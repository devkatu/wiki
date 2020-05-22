onmessage = function(e){
  let myDate;
  for(let i = 0; i < 1000000; i++){
    let date = new Date();
    myDate = date;
  }

  postMessage(myDate);
}
