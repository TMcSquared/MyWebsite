function setupSoundOnClick(array,id,sound){
  array.push(document.getElementById(id));
  array[array.length-1].onmousedown =function(e){
    sound.play();
  };
};
function setupSoundOnHover(array,id,sound){
  array.push(document.getElementById(id));
  array[array.length-1].onmouseover =function(e){
    sound.play();
  };
};
