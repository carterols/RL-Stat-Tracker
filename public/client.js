function User (name, platform, doublesRank, standardRank, soloRank) {
    this.name = name;
    this.platform = platform;
    this.doublesRank = doublesRank;
    this.standardRank = standardRank;
}

const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', function (event) {
    var displayName = document.getElementById('username').value;

    var platforms = {
        "STEAM": "1",
        "PS4": "2",
        "XB1": "3"
    };
    var platform = platforms[document.getElementById('platforms').value];

    var requestURL = '/getPlayer/' + displayName + "/" + platform;

    window.location.href = requestURL;
});