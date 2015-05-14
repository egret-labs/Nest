
function random_1(){

    function randomsort(a, b) {
        return Math.random()>0.5 ? -1 : 1;
    }

    var recordsOld = [
        {name:"女神"},
        {name:"猎刃"},
        {name:"三国"},
        {name:"海贼王"},
        {name:"貂蝉"},
        {name:"恶魔"},
        {name:"愚公"},
        {name:"古龙"}
    ];

    var rank = 0;

    var records = recordsOld.sort(randomsort);     
    var result = records[rank]
    console.log (result.name)

}



function random_2(){


    function randomsort(a, b) {
        return Math.random() > 0.5 ? 1 : -1;
    }

    var recordsOld = [
        {name:"女神"},
        {name:"猎刃"},
        {name:"三国"},
        {name:"海贼王"},
        {name:"貂蝉"},
        {name:"恶魔"},
        {name:"愚公"},
        {name:"古龙"}
    ];

    var rank = 0;

    var count = Date.now() % 100
    // var count = parseInt(Math.random() * 200) 

    for (var i = 0 ; i < count ; i++){
        var recordsOld = recordsOld.sort(randomsort)
    }
    records = recordsOld.concat();
    var result = records[rank]
    console.log (result.name)

}


function random_3(){
 Array.prototype.shuffle = function() {
    var that = this, j, x, i;
    for (i = that.length - 1; i >= 0; i--) {
        j = parseInt(Math.random() * (i + 1), 10);
        x = that[i];
        that[i] = that[j];
        that[j] = x;
    }
    return that;
};
 var recordsOld = [
        {name:"女神"},
        {name:"猎刃"},
        {name:"三国"},
        {name:"海贼王"},
        {name:"貂蝉"},
        {name:"恶魔"},
        {name:"愚公"},
        {name:"古龙"}
    ];
    var rank = 0;
    recordsOld.shuffle();
     var result = recordsOld[rank]
    console.log (result.name)
}




random_3();

