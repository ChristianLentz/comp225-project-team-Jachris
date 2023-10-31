function getData() {
    user_email = document.getElementById("user_email").value;
    firebase.database().ref("users/" + user_email).on('value', function(snapshot){ 
        snapshot.forEach(function(getUserEmail){
            email_data = getUserEmail.val();
            name = getUserEmail.key;

            email = email_data["email: "]
            // see if it is in console 
            console.log(name, email)

            row =" <h1>" + name + "</h1>";
            document.getElementById("score_table").innerHTML = row;
        });
    });
}
getData();