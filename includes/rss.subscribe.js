window.addEventListener('DOMContentLoaded', function() {
  var si = document.getElementById("subscribeInfo");
  var ft = document.getElementById("feedTitle");
  if(si && ft) { //in webfeeds.html
    var select = document.getElementById("readers");
    if(select) {
      var opt = document.createElement("option");
      opt.setAttribute('value', "https://bazqux.com/add?url="+escape(window.location));
      opt.innerHTML = "BazQux Reader";
      select.appendChild(opt);
    }
  }
},false);