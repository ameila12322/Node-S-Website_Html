const loadPricesImg = () => {
    var img = new Image,
    c = document.getElementById("prices"),
    ctx = c.getContext("2d"),
    src = "https://cors-anywhere.herokuapp.com/http://51.15.127.80/prices.png"; 
        
    img.crossOrigin = "Anonymous";

    img.onload = function() {
        c.width = img.width;
        c.height = img.height;

        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        drawImage(img, ctx);
    }
    img.src = src;

    if ( img.complete || img.complete === undefined ) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
};

const loadBalancesImg = () => {
    var img = new Image,
    c = document.getElementById("balances"),
    ctx = c.getContext("2d"),
    src = "https://cors-anywhere.herokuapp.com/http://51.15.127.80/balancechart.png"; 
        
    img.crossOrigin = "Anonymous";

    img.onload = function() {
        c.width = img.width;
        c.height = img.height;

        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        drawImage(img, ctx);
    }
    img.src = src;

    if ( img.complete || img.complete === undefined ) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
};

function drawImage(img, ctx) {
    ctx.drawImage(img, 0, 0);

    setTimeout(() => {
    var imageData = ctx.getImageData(0, 0, img.width, img.height);
    const { data } = imageData;
    const { length } = data;
    
    for (let i = 0; i < length; i += 4) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
    }

    ctx.putImageData(imageData, 0, 0);

    setTimeout(() => {
        for (let i = 0; i < length; i += 4) {
            const r = data[i + 0];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
    
            if(r < 10 && g < 10 && b < 10) // if is black
            {
                data[i] = 19;
                data[i+1] = 23;
                data[i+2] = 34;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }, 100);
    }, 100);
}

const loadDiscord = () => {
    const svName = document.getElementById("discordName"),
          svUsers = document.getElementById("discordUsers"),
          svUsersN = document.getElementById("discordUsersN");

    var init = {
        method: 'GET',
        mode: 'cors',
        cache: 'reload'
    }

    fetch('https://discordapp.com/api/guilds/677615191793467402/widget.json', init).then(function(response){
        if(response.status != 200){
            console.log("it didn't work" + response.status);
            return;
        }
        response.json().then(function(data){

        var users = data.members;
        var serverName = data.name;

        let liWrap = document.createElement('ul');
        liWrap.classList.add('channels--list--wrap');

        svName.innerHTML = serverName;

        svUsersN.innerHTML = data.members.length+" Members Online";

        function usersFill(){
            for(let n = 0; n < 14; n++){
            
            let userWrap = document.createElement('div');
            let userImage = document.createElement('img');
            let userStatus = document.createElement('div');
            let imageWrap = document.createElement('div');

            userWrap.classList.add('user-avatar');
            
            userStatus.classList.add('status-overlay');
            userStatus.classList.add('dot');
            
            imageWrap.classList.add('image--wrap');
            
            if(users[n].status === 'online'){
                userStatus.classList.add('online')
            }
            if(users[n].status === 'idle'){
                userStatus.classList.add('idle');
            }
            if(users[n].status ==='dnd'){
                userStatus.classList.add('afk');
            }
            
            userImage.classList.add('avatar');
            userImage.setAttribute('src', data.members[n].avatar_url);
            
            imageWrap.appendChild(userStatus);
            imageWrap.appendChild(userImage)
            userWrap.appendChild(imageWrap);
            
            svUsers.appendChild(userWrap);

            }
        }      

        usersFill();
        });
    });
};

const getJSON = (url, qs_params = "") => {
    const buildQueryString = (params) => {
      return Object.entries(params)
        .map((d) => `${d[0]}=${d[1]}`)
        .join("&");
    }
  
    return new Promise((resolve, reject) => {
      const qs = qs_params ? "?" + buildQueryString(qs_params) : "";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${url}${qs}`);
  
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          resolve(xhr.responseText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

const loadData = () => {
    const exchR = document.getElementById("exchangeRate");
    getJSON(
        "https://cors-anywhere.herokuapp.com/http://www.node-s.co.za/api/v1/duco/exchange_rate"
      ).then((data) => {
        exchR.innerHTML = `1ᕲ = $${data["value"]}`;
      });
    setTimeout(() => {
        loadData();
    }, 3500);
};
const element = document.getElementById("exchangeRate");
if (typeof(element) != 'undefined' && element != null)
{
    if (document.addEventListener) { 
        document.addEventListener("DOMContentLoaded", () => {
            loadBalancesImg();
            loadPricesImg();
            loadDiscord();
            loadData();
        }, false);
    }
    else if (/WebKit/i.test(navigator.userAgent)) { 
        let _timer = setInterval(() => {
        if (/loaded|complete/.test(document.readyState)) {
            loadBalancesImg();
            loadPricesImg();
            loadDiscord();
            loadData();
        }
        }, 10);
    }
    else window.onload = () => {
        loadBalancesImg();
        loadPricesImg();
        loadDiscord();
        loadData();
    };
}