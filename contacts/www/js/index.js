var myContact;
var newContact
var Namer;
var parsing;
var sweeper;
var adder;
var builder;
var networkState;
var addresses = [];
var userName;
var userPhone;
var userProvince;
var userAddress;
var userCity;
var contacts;
var lists;
var listings;
var count;
var keeper;
var shitstick;
var submitBtn;
var contacters;

var app = {
    initialize: function() {
        console.log("In initializes");
        shitstick = 0;
        this.bindEvents();             
    }, 
    bindEvents: function() {
        console.log("in bindEvents");

        sweeper = document.getElementById("contactSweeper");
        adder = document.getElementById("newContact");
        builder = document.getElementById("buildContact");
		addContactBtn = document.getElementById("submitBtn");
		displayContactsBtn = document.getElementById("displayContactsBtn");
		submitBtn = document.getElementById("submitBtn");
        contacters = document.getElementById("newContact");
		
        document.addEventListener('deviceready', this.onDeviceReady, false);
        sweeper.addEventListener('click',this.contactFinder, false);
        adder.addEventListener('click',this.displayAddContactForm, false);
        builder.addEventListener('click',this.contactBuilder,false);
		addContactBtn.addEventListener('click', this.loadLocation, false);
		displayContactsBtn.addEventListener('click', this.displayContacts, false);
        submitBtn.addEventListener('click',this.closeForm, false);
        contacters.addEventListener('click',this.formControl,false);

    },
    onDeviceReady: function() {
        networkState = navigator.network.connection.type;
        console.log("in onDeviceReady");
        app.checkConnection();
    },

displayAddContactForm: function() {
	var newContactForm = document.getElementById("newContactForm");
	newContactForm.style.display = 'block';
},

    contactStarter: function(connection) {
        console.log(connection);
        if(connection == "online") {
            var request = new XMLHttpRequest();
            request.open("GET","https://dl.dropboxusercontent.com/u/887989/MAD9135/contacts.json",true);
            console.log("After request.open");
            request.onreadystatechange = function() {
                if(request.readyState == 4) {
                    if(request.status == 200 || request.status == 0) {
                        console.log("Request.status is A OK/is working");
                        parsing = JSON.parse(request.responseText);

                        var fields = ["displayName", "name"];

                        var options = {};
                        options.filter = "";
                        options.multiple = true;
                        
                        console.log("Before finding contacts");
                        navigator.contacts.find(fields,app.findSuccess,app.findError,options);
                        console.log("After finding contacts");
                    }
                }
            }
            console.log("before request.send");
            request.send();
            console.log("after request.send");
        } else {
            console.log("app will not run offline");
        }
    },

    contactFinder: function() {
        var fields = ["displayName", "name"];

        var options = {};
        options.filter = "";
        options.multiple = true;
                        
        console.log("Before finding contacts");
        navigator.contacts.find(fields,app.findSuccess,app.findError,options);
        console.log("After finding contacts");
    },

    contactBuilder: function() {
        console.log("In contactbuilder");
        for(var i = 0; i < parsing.length; i++) {

            myContact = navigator.contacts.create();
            myContact.displayName = parsing[i].firstname+" "+parsing[i].lastname;
            myContact.nickname = parsing[i].firstname;

            Namer = new ContactName();
            Namer.givenName = parsing[i].firstname;
            Namer.familyName = parsing[i].lastname;
            myContact.name = Namer;

            addresses = [];
            var address = new ContactAddress();
            address.streetAddress = parsing[i].street;
            address.locality = parsing[i].city;
            address.region = parsing[i].state;
            addresses[0] = address;
            myContact.addresses = addresses; 

            if(parsing[i] != "undefined") {
                var phoneNumbers = [];
                phoneNumbers[0] = new ContactField('mobile',parsing[i].phone, false);
                myContact.phoneNumbers = phoneNumbers;    
            }

            var emails = [];
            emails[0] = new ContactField('home',parsing[i].email,false);
            myContact.emails = emails;
            shitstick++;
    
            myContact.save(app.onSuccessCall, app.onErrorCall);             
        }           
    },

addContact: function() {
	console.log("In add contact");
	userName = document.getElementById("nameTxt");
	userPhone = document.getElementById("phoneNumberTxt");
	userProvince = document.getElementById("provinceTxt");
	userAddress = document.getElementById("streetAddressTxt");
	userCity = document.getElementById("cityTxt");
	
	console.log(userAddress);
},

    loadLocation: function() {
        console.log("in loadLocation");
        var options = {
            enableHighAccuracy: true, timeout:360000
        }
		console.log("about to call getposition");
        navigator.geolocation.getCurrentPosition(
            app.getPosition, 
            app.geolocationErrors,
            options
        );
    },

    getPosition: function(position) {
		console.log("In get position");
		userName = document.getElementById("nameTxt").value;
	userPhone = document.getElementById("phoneNumberTxt").value;
	userProvince = document.getElementById("provinceTxt").value;
	userAddress = document.getElementById("streetAddressTxt").value;
	userCity = document.getElementById("cityTxt").value;
	userEmail = document.getElementById("emailTxt").value;
	
	console.log(userName);
	
        console.log("You are at "+position.coords.latitude+","+position.coords.longitude);

        newContact = navigator.contacts.create();
        newContact.displayName = userName;
        newContact.nickname = "Drew";

        Namer = new ContactName();
        Namer.givenName = "Drew";
        Namer.familyName = "Johnson";
        newContact.name = Namer;

        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', userPhone, false);
        newContact.phoneNumbers = phoneNumbers;

        var emails = [];
        emails[0] = new ContactField('home', userEmail,false);
        newContact.emails = emails;
		
		
		
		var addresses= [];
                var address = new ContactAddress();
                address.locality = userCity;
                address.streetAddress = userAddress;
                address.type = "Home";
                address.region = userProvince;
                
                addresses[0]= address;
               
                newContact.addresses = addresses;

        console.log("Before New COntact address request");
		console.log(userName, userPhone, userProvince, userAddress, userCity);
        var request = new XMLHttpRequest();
        request.open("GET","http://open.mapquestapi.com/geocoding/v1/reverse?" + "key=Fmjtd|luur2hurn0%2Cbg%3Do5-9wasly&location=" +position.coords.latitude + "," + position.coords.longitude,true);
        request.onreadystatechange = function() {
            console.log("in XML request");
            if(request.readyState === 4) {
                if(request.status === 200 || request.status === 0) {
console.log("request status success");
console.log(request.responseText);
                    var reality = JSON.parse(request.responseText);
                    console.log(reality.results[0].locations[0].adminArea5);

                    addresses = [];
                    var address = new ContactAddress();
                    address.streetAddress = reality.results[0].locations[0].street;
                    address.locality = reality.results[0].locations[0].adminArea5;
                    address.region = reality.results[0].locations[0].adminArea3;
                    address.country = reality.results[0].locations[0].adminArea1;
                    address.postalCode = reality.results[0].locations[0].postalCode;
                    addresses[0] = address;
                    newContact.address = address; 

                    newContact.save(app.onSuccessCall, app.onErrorCall);
					
					console.log(newContact);
                    shitstick++;
					//console.log(app.onErrorCall(Error));
                }
            } 
        };   
        request.send(); 
		console.log("Successfully Added Contact");       
    },

    findSuccess: function(contact) {
        console.log("Amount of contacts is: "+contact.length);
        if(contact.length == 0) {
            console.log("About to call contact builder");
          app.contactBuilder();
        }
        else {
            console.log("Amount of contacts is: "+contact.length);
            for(var k = 0; k < contact.length; k++) {
                contact[k].remove(app.removeSuccess,app.removeError);
            }
        }  
    },

    findError: function(Error) {                             
        console.log("could not find Contact but got "+Error.code);
        app.contactBuilder();
    },

    removeSuccess: function(contact) {
        console.log("Successfully removed contact");
        shitstick = 0;
    },

    removeError: function(Error) {
        console.log("Could not remove contact and got "+Error.code);
    },

    onSuccessCall: function(Success) {
        console.log("Made a contact for person with "+Success);

    },

    onErrorCall: function(Error) {
        console.log("Error with saving contact with error code "+Error.code);
    },

    geolocationErrors: function(error) {
        console.log(error.code);
    },

displayContacts: function() {
	console.log("in display");
	var filter = {
  sortBy: name,
  
  filterBy: ['name'],
  //filterValue: 'c',
  
}
        lists = document.getElementById("contactDisplayer");
        lists.innerHTML = "";

var request = window.navigator.mozContacts.getAll({});
var count = 0;

request.onsuccess = function () {
  if(this.result) {
    count++;
console.log(this.result);
    // Display the name of the contact
    console.log(this.result.givenName + ' ' + this.result.familyName);
/*if(count < shitstick) {           		
            		console.log("In if (count < shitstick) loop");
            		

                    lists.innerHTML += "<li>" + this.result.givenName + "</li>";
            	}*/
		
		
	var contacts = document.getElementById("contacts");
	
	var ul = document.createElement("ul");
	
	var givenName;
	var familyName;
	var tel; //= this.result.tel[0].value;
	var email;
	var streetAddress;
	var city;
	var province;
	
	
	if(this.result.adr[0].streetAddress)
	{
		console.log(this.result.adr[0].streetAddress);
		streetAddress = this.result.adr[0].streetAddress;
		
		
	}else{
                streetAddress = "";
            }
			
	if(this.result.adr[0].locality)
	{
		
		city = this.result.adr[0].locality;
		
		
	}else{
                city = "";
            }
			
			if(this.result.adr[0].region)
	{
		
		province = this.result.adr[0].region;
		
		
	}else{
                province = "";
            }
	
	if (this.result.givenName)
	{
		givenName = this.result.givenName;
	}else{
                givenName = "";
            }
	
	if (this.result.familyName)
	{
		familyName = this.result.familyName;
	}else{
                familyName = "";
            }
	
	 if (this.result.tel[0]){
                tel = this.result.tel[0].value;
            }else{
                phoneNum = "";
            }
	
	if (this.result.email[0].value)
	{
		email = this.result.email[0].value;
	}else{
                email = "";
            }
	
	console.log(givenName);
	console.log(familyName);
	console.log(tel);
	console.log(email);
	
	for (var i = 0; i < count; i++)
	{
		
		console.log("In for loop");
		var li = document.createElement("li");
		li.innerHTML = givenName + " " + familyName + "<br>" + tel + "<br>" + email + "<br>" + streetAddress + "<br>" + city + "<br>" + province;
		console.log(li);
		
	}
	ul.appendChild(li);
	contacts.appendChild(ul);

    // Move to the next contact which will call the request.onsuccess with a new result
    this.continue();

  } else {
    console.log(count + 'contacts found.');
  }
}

request.onerror = function () {
  console.log('Something goes wrong!');
}
},



    checkConnection: function() {
        if(networkState != "none") {
            sim.goOnline();
        } else {
            sim.goOfline();
        }
    },

//The newContactForm does not change despite logging it is being updated
    closeForm: function(ev) {
        ev.preventDefault();
        console.log("in closeForm");
        var contactForm = document.getElementById("newContactForm");
        contactForm.className = "inactive";
    },

//The newContactForm does not change despite logging it is being updated
    formControl: function(ev) {
        ev.preventDefault();

        var formMode = document.getElementById("newContactForm");

        console.log(formMode.style.display);
        if (formMode.style.display == "none") {
            formMode.style.display = "block";
            console.log(formMode+" is active");
        } else {
            console.log(" hide me")
            formMode.style.display = "none";
        }
    }
};

var sim = {
    goOffline: function() {
        sim._dispatchEvent("offline");
    },
    goOnline: function() {
        sim._dispatchEvent("online");
    }, 
    _dispatchEvent: function(eventType) {
        var event = document.createEvent('Event');
        event.initEvent(eventType, true, true);
        document.dispatchEvent(event);
        app.contactStarter(eventType);
    }
};

app.initialize();//Inline script calls are potentially so firewalls will prevent it by default
