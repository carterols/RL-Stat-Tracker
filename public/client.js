function User (name, platform, doublesRank, standardRank, soloRank) {
    this.name = name;
    this.platform = platform;
    this.doublesRank = doublesRank;
    this.standardRank = standardRank;
}

const searchButton = document.getElementById('submitButton');
searchButton.addEventListener('click', function (event) {
    var userName = document.getElementById('username').value;
    var request = new XMLHttpRequest();
    var requestURL = '/getPlayer';
    request.open('GET', requestURL);

    var player = {
        name: userName,
        platform: 'XB1'
    };

    var requestBody = JSON.stringify(player);
    
    request.setRequestHeader('Content-Type', 'application/json');

    request.addEventListener('load', function (event) {
        if (event.target.status !== 200) {
            alert("Error! Problem finding player: " + event.target.response);
        }
        else {
            console.log(event.target.response);
        }
    });

    request.send(requestBody);
});