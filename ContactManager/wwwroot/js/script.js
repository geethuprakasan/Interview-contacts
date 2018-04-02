var contactScope = {
    isBeingEdited: false,
    currentEditId: 0,
    currentDeleteId: 0,
    contactList: []
}

$(document).ready(function () {
    getContactList();
});

// prevent form from submitting
$(document).on("submit", "form", function (e) {
    e.preventDefault();
    if (contactScope.isBeingEdited)
        editContact();
    else
        addNewContact();

    return false;
});


var Contact = {
    name: "",
    phone: "",
    email: "",
    address: ""
};

//save New Contact to Db
function addNewContact() {
    var options = {};
    options.url = "/api/Contacts";
    options.type = "POST";

    var obj = Contact;

    obj.id = 0;
    obj.name = $("#name").val();
    obj.phone = $("#phone").val();
    obj.email = $("#email").val();
    obj.address = $("#address").val();
    //    console.dir(obj);
    options.data = JSON.stringify(obj);
    options.contentType = "application/json";
    options.dataType = "html";

    options.success = function (msg) {
        $('#addUserModal').modal('hide');
        clearForm();
        getContactList();
        //console.log(msg);
    }, options.error = function () {
        console.log("Error while calling the Web API!");
    };
    $.ajax(options);
}

//save editted Contact to Db
function editContact() {
    var options = {};
    options.url = "/api/Contacts/" + contactScope.currentEditId;
    options.type = "PUT";

    var obj = Contact;
    obj.id = contactScope.currentEditId;
    obj.name = $("#name").val();
    obj.phone = $("#phone").val();
    obj.email = $("#email").val();
    obj.address = $("#address").val();
    //    console.dir(obj);
    options.data = JSON.stringify(obj);
    options.contentType = "application/json";
    options.dataType = "html";

    options.success = function (msg) {
        $('#addUserModal').modal('hide');
        clearForm();
        getContactList();
        //console.log(msg);
    }, options.error = function () {
        console.log("Error while calling the Web API!");
    };
    $.ajax(options);
}


function clearForm() {
    contactScope.isBeingEdited = false;
    $("#name").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#address").val("");
}

function populateFormAndOpenModal(contactId) {

    var contact = getContactFromId(contactId);
    contactScope.isBeingEdited = true;
    contactScope.currentEditId = contactId;
    $("#name").val(contact.name);
    $("#phone").val(contact.phone);
    $("#email").val(contact.email);
    $("#address").val(contact.address);

    // now open modal
    $('#addUserModal').modal('show');
}

function getContactFromId(id) {
    var contacts = contactScope.contactList;
    var returnObj;
    var arrayLength = contacts.length;
    for (var i = 0; i < arrayLength; i++) {
        if (contacts[i].id == id) {
            returnObj = contacts[i];
            break;
        }
    }
    return returnObj;
}

// Get all Contacts to display  
function getContactList() {
    $(".spinner-wrap").show();
    $(".empty-msg").hide();
    // Call Web API to get a list of Contacts  
    $.ajax({
        url: '/api/Contacts/',
        type: 'GET',
        dataType: 'json',
        success: function (contacts) {
            $(".spinner-wrap").hide();
            contactListSuccess(contacts);
            if (contacts.length) {
                $(".empty-msg").hide();
            } else {
                $(".empty-msg").show();
            }
            contactScope.contactList = contacts;
        },
        error: function (request, message, error) {
            $(".spinner-wrap").hide();
            console.log("Error while calling the Web API!");
        }
    });
}


function onDeleteContact(id) {
    contactScope.currentDeleteId = id;
    $('#delete-confirm-modal').modal('show')

}

//delete contact
function removeContact() {
    $.ajax({
        url: '/api/Contacts/' + contactScope.currentDeleteId,
        type: 'DELETE',
        dataType: 'json',
        success: function (contacts) {
            getContactList();
            contactScope.currentDeleteId = 0;
            $('#delete-confirm-modal').modal('hide')
        },
        error: function (request, message, error) {
            console.log("Error while calling the Web API!");
        }
    });
}

// Display all Contacts returned from Web API call  
function contactListSuccess(contacts) {
    // Iterate over the collection of data  
    $("#contacts-table tbody").remove();
    $.each(contacts, function (index, contact) {
        // Add a row to the employee table  
        contactAddRow(contact);
    });
}

// Add contact row to <table>  
function contactAddRow(contact) {
    // First check if a <tbody> tag exists, add one if not  
    if ($("#contacts-table tbody").length == 0) {
        $("#contacts-table").append("<tbody></tbody>");
    }

    // Append row to <table>  
    $("#contacts-table tbody").append(contactBuildTableRow(contact));
}

// Build a <tr> for a row of table data  
function contactBuildTableRow(contact) {

    var newRow = "<tr>" +
        "<td>" + contact.name + "</td>" +
        "<td>" + contact.phone + "</td>" +
        "<td>" + contact.email + "</td>" +
        "<td>" + contact.address + "</td>" +
        "<td class='edit-btn' onclick='populateFormAndOpenModal(" + contact.id + ")' > <i class='fa fa-pencil-square-o' aria-hidden='true'></i> </td>" +
        "<td class='remove-btn' onclick='onDeleteContact(" + contact.id + ")' ><i class='fa fa-trash' aria-hidden='true'></i></td>" +
        "</tr>";

    return newRow;
}