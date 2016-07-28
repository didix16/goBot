/*This file must be called by fork*/
var seconds = 5;
var c = 0;
function await(){
	setTimeout(function(){
		//awaiting...
		++c;
		if(c<seconds)
			await();
	},1000);
}
await();

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}