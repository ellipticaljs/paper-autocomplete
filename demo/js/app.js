

(function(){

    HTMLImports.whenReady(function(){
        localBind();
        document.addEventListener('autocomplete.selected',onSelect);
        document.addEventListener('autocomplete.change',onChange)
    });

    function localBind(){
        //local states array
        var states=[
            {
                "text": "Alabama",
                "value": "AL"
            },
            {
                "text": "Alaska",
                "value": "AK"
            },
            {
                "text": "American Samoa",
                "value": "AS"
            },
            {
                "text": "Arizona",
                "value": "AZ"
            },
            {
                "text": "Arkansas",
                "value": "AR"
            },
            {
                "text": "California",
                "value": "CA"
            },
            {
                "text": "Colorado",
                "value": "CO"
            },
            {
                "text": "Connecticut",
                "value": "CT"
            },
            {
                "text": "Delaware",
                "value": "DE"
            },
            {
                "text": "District Of Columbia",
                "value": "DC"
            },
            {
                "text": "Federated States Of Micronesia",
                "value": "FM"
            },
            {
                "text": "Florida",
                "value": "FL"
            },
            {
                "text": "Georgia",
                "value": "GA"
            },
            {
                "text": "Guam",
                "value": "GU"
            },
            {
                "text": "Hawaii",
                "value": "HI"
            },
            {
                "text": "Idaho",
                "value": "ID"
            },
            {
                "text": "Illinois",
                "value": "IL"
            },
            {
                "text": "Indiana",
                "value": "IN"
            },
            {
                "text": "Iowa",
                "value": "IA"
            },
            {
                "text": "Kansas",
                "value": "KS"
            },
            {
                "text": "Kentucky",
                "value": "KY"
            },
            {
                "text": "Louisiana",
                "value": "LA"
            },
            {
                "text": "Maine",
                "value": "ME"
            },
            {
                "text": "Marshall Islands",
                "value": "MH"
            },
            {
                "text": "Maryland",
                "value": "MD"
            },
            {
                "text": "Massachusetts",
                "value": "MA"
            },
            {
                "text": "Michigan",
                "value": "MI"
            },
            {
                "text": "Minnesota",
                "value": "MN"
            },
            {
                "text": "Mississippi",
                "value": "MS"
            },
            {
                "text": "Missouri",
                "value": "MO"
            },
            {
                "text": "Montana",
                "value": "MT"
            },
            {
                "text": "Nebraska",
                "value": "NE"
            },
            {
                "text": "Nevada",
                "value": "NV"
            },
            {
                "text": "New Hampshire",
                "value": "NH"
            },
            {
                "text": "New Jersey",
                "value": "NJ"
            },
            {
                "text": "New Mexico",
                "value": "NM"
            },
            {
                "text": "New York",
                "value": "NY"
            },
            {
                "text": "North Carolina",
                "value": "NC"
            },
            {
                "text": "North Dakota",
                "value": "ND"
            },
            {
                "text": "Northern Mariana Islands",
                "value": "MP"
            },
            {
                "text": "Ohio",
                "value": "OH"
            },
            {
                "text": "Oklahoma",
                "value": "OK"
            },
            {
                "text": "Oregon",
                "value": "OR"
            },
            {
                "text": "Palau",
                "value": "PW"
            },
            {
                "text": "Pennsylvania",
                "value": "PA"
            },
            {
                "text": "Puerto Rico",
                "value": "PR"
            },
            {
                "text": "Rhode Island",
                "value": "RI"
            },
            {
                "text": "South Carolina",
                "value": "SC"
            },
            {
                "text": "South Dakota",
                "value": "SD"
            },
            {
                "text": "Tennessee",
                "value": "TN"
            },
            {
                "text": "Texas",
                "value": "TX"
            },
            {
                "text": "Utah",
                "value": "UT"
            },
            {
                "text": "Vermont",
                "value": "VT"
            },
            {
                "text": "Virgin Islands",
                "value": "VI"
            },
            {
                "text": "Virginia",
                "value": "VA"
            },
            {
                "text": "Washington",
                "value": "WA"
            },
            {
                "text": "West Virginia",
                "value": "WV"
            },
            {
                "text": "Wisconsin",
                "value": "WI"
            },
            {
                "text": "Wyoming",
                "value": "WY"
            }
        ];

        var inputLocal=document.querySelector('#input-local');
        inputLocal.source=states;
    }

    function getToast(){
        return document.querySelector('paper-toast');
    }

    function onSelect(event){
        var selected=event.detail.option.text;
        var paperToast=getToast();
        paperToast.text='Selected: ' + selected;
        paperToast.show();
    }

    function onChange(event){
        var input=document.querySelector('#input-remote');
        var paperToast=getToast();
        var search=event.detail.option.text;
        var url='https://api.github.com/search/users?q=' + search + '+in:login';
        var req= new XMLHttpRequest();
        req.open('GET',encodeURI(url));
        req.onload = function() {
            if (req.status === 200) {
                var data=JSON.parse(req.response);
                var arr=data.items.map(function(obj){
                    return {text:obj.login,value:obj.login};
                });
                input.suggestions(arr);
            }
            else{
                paperToast.text='Api Error';
                paperToast.show();
            }
        };
        req.send();
    }


})();