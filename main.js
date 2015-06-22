/*
    
    For the use of Grid consult Grid.js
*/
    var categoryIndex = 0;
    var videoIndex = 0;
    var Slide = 110;
    var TranDis = 257;
    // some add 
    var rowArray = [];
    //var catIndex = 0;// this is the category with the video to be played
    //var vidIndex = 0; // this is the video to be played
    var boxInView = 6;
    var boxWidth = 272;
    var boxHeight = 135;
    var Data;
    var aniTIme = 100;
    var timeBetweenClicks= aniTIme + 50;
    var lasClick = 0;
    var rowHeight = 216;
    var someFlag = false;
    
$(document).ready( function(){
	getData();    
});

document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        if(checkIfMoveCat(categoryIndex - 1 ,"up")){
            moveRowUp(categoryIndex, true);
            addSelectedTo(categoryIndex);
        }
        
    }
    else if (e.keyCode == '40') {
        // down arrow
        if(checkIfMoveCat(categoryIndex + 1 ,"down")){
            moveRowDown(categoryIndex, true);
            addSelectedTo(categoryIndex);
        }
    }
    else if (e.keyCode == '37') {
       // left arrow
        var d = new Date();
        if( d.getTime() - lasClick > timeBetweenClicks ){
           lasClick = d.getTime();
           if(checkifValidSide(categoryIndex ,"left")){
                moveRowLeft(categoryIndex, true);
                addSelectedTo(categoryIndex);
            }
        }
    }
    else if (e.keyCode == '39') {
       // right arrow
        var d = new Date();
        if( d.getTime() - lasClick > timeBetweenClicks ){
            lasClick = d.getTime();
            if(checkifValidSide(categoryIndex ,"right")){
                moveRowRight(categoryIndex, true);
                addSelectedTo(categoryIndex);
            }
        }
    }

}


function getData(){
    $.getJSON( "app_272.json", function( data ) {
        Data = data;
        initLayout();
        iniBackAndLogo();
    });
}



/*
SceneManager.main = (function () {
	var categoryIndex = 0;
	var videoIndex = 0;
	var Slide = 110;
	var TranDis = 257;
    // some add 
    var rowArray = [];
    //var catIndex = 0;// this is the category with the video to be played
    //var vidIndex = 0; // this is the video to be played
    var boxInView = 6;
    var boxWidth = 250;
    var boxHeight = 135;
	SceneManager.onmain = function (event, from, to, msg) {
		if (!$("#Scenemain").length) {
			$("<div>").load("app/htmls/main.html", function () {
				$("body").append($(this).html());
				initScene();
				//loadVideos();
                initLayout();
                iniBackAndLogo();
			});
		}else{
			$("#Scenemain").show();
			initScene();
            
		}
	};

	SceneManager.onleavemain = function (event, from, to, msg) {
		$("#Scenemain").hide();
	};
    */
    function initScene() {
		Scene.onPopupShow = onPopupShow;
		Scene.onPopupHide = onPopupHide;
    
        Scene.keys = SceneKeys;
		Scene.keys();
	}
    
    function onPopupShow() {
        //currentGrid.removeAllSelected();
	}

	function onPopupHide() {
        //currentGrid.returnSelected();
	}
    
    function SceneKeys() {
		unbind_keys();
		$(document).keydown(function (e) {
			//console.log(e.keyCode);
			switch (e.keyCode) {
			case tvKey.KEY_LEFT:
				
				break;
			case tvKey.KEY_UP:
                
				break;
			case tvKey.KEY_DOWN:
                
				break;
			case tvKey.KEY_RIGHT:
                
				break;
			case tvKey.KEY_INFO:
				PopUpAbout.show();
				break;
			case tvKey.KEY_PLAY:
			case tvKey.KEY_ENTER:
                DataManager.CatIndex = currentSelected;
                DataManager.VideoIndex = currentGrid.returnIndex();
                SceneManager.mainToplayer();
				break;
			case tvKey.KEY_RETURN:
                PopUpExit.show("Do you want to exit?","<div id='btn-Yes' class='popUpButton focus'>Yes</div><div id='btn-No' class='popUpButton'>No</div>");

                break;
			case tvKey.KEY_EXIT:
				widgetAPI.sendExitEvent();
                
				break;
			}
            
		});
	}
    
    
    /******* ADDED ****/
    function iniBackAndLogo(){
    
        $("#Scenemain").css('background', 'url(' + Data.background + ')');
        $("#Scenemain").addClass("selectedBackground");
        $("#mainLogo").css('background', 'url(' + Data.logo + ') no-repeat');
        $("#mainLogo").addClass("selectedLogo");
    }
    
    
    
    function initLayout(){ // remember to validate
        var list = Data;
        for( var i =0 ; i < Data.list.length; i++){
            var color = getColor(i);
            var title = Data.list[i].name ;
            var newRow = new rowClass(title, color, 0, i, Data.list[i].videos.length);
            rowArray.push(newRow);
        }
        if(Data.list.length > 0 ){
            
            $("#rowCont").append(createRow(  0));
            moveRowRight( 0 , false);
            addSelectedTo(categoryIndex);
            if(Data.list.length > 1){
                $("#rowCont").append(createRow(  1));
                moveRowRight( 1 , false);
/*                $("#rowCont").append(createRow(  2));
                moveRowRight( 2 , false);*/
            }
        }else{
            console.log("There is no data in Data.list.length");
        }
    }

function checkIfMoveCat(catInd ,dir){
    if( dir =="up" && catInd >= 0 ){
        return true;
    }
    if(dir=="down" && catInd < Data.list.length){
        return true;
    }
    return false;
}

    function checkifValidSide(catIndex,  dir){
        
        if(dir=="left"){
            
            if(rowArray[catIndex].vidIndex -1 >= 0){
                
                rowArray[catIndex].vidIndex--;
                
                return true;
            }
        }
        if(dir=="right"){
            if(rowArray[catIndex].vidIndex + 1 < rowArray[catIndex].length){
                rowArray[catIndex].vidIndex++;
                
                return true;
            }
        }
        return false;
    }
    function checkIfCreateDestroy(iRow, dir){
        if( rowArray[iRow].vidIndex + boxInView - 2   < rowArray[iRow].length && dir == "right" &&   rowArray[iRow].length > boxInView - 2    ){
            return true;
        }
        if( dir == "left" ){
            return true;
        }
        return false;
    }
    function createDestroy(idRow, dir){
        var category = Data.list[idRow];
        if(dir=="left"){
            
            var destroyVid = rowArray[idRow].vidIndex + boxInView -2;
            if( destroyVid < rowArray[idRow].length ){
                var iVid = rowArray[idRow].vidIndex-1;
                if(iVid < 0){
                    iVid = -1000;
                }
                var newBox = createVideoBox(category.videos[iVid], idRow, iVid);
                $("#row"+idRow).prepend(newBox);
                $("#row"+idRow+"> div:last-child").remove(); 
            }else{
                
                var iVid = rowArray[idRow].vidIndex-1;
                if(iVid < 0){
                    iVid = -1000;
                }
                var newBox = createVideoBox(category.videos[iVid], idRow, iVid);
                $("#row"+idRow).prepend(newBox);
                
            }
        }

        if(dir=="right"){
            $("#row"+idRow).find('div').first().remove();
            var category = Data.list[idRow];
            var iVid = rowArray[idRow].vidIndex + boxInView - 2 ;
            if(iVid  < rowArray[idRow].length){
                var newBox = createVideoBox(category.videos[iVid] , idRow, iVid);
                $("#row"+idRow).append(newBox);
            }

        }
    }

    function moveRowRight(index, animation){
        var movePixels;
        
        if(animation){
            movePixels = "-=" + boxWidth + "px";
            $("#row"+index).animate({
                left: movePixels 
            },aniTIme,function(){
                movePixels = -boxWidth ;
                if(checkIfCreateDestroy(categoryIndex,"right")){
                    $("#row"+index).css("left", movePixels+"px");
                    createDestroy(categoryIndex, "right");
                }
            });
        }else{
            movePixels = -boxWidth ;
            $("#row"+index).css("left", movePixels+"px");
        }
    }
    

    function moveRowLeft(index, animation){
        var movePixels;
       
        if(animation){
            
            var destroyVid = rowArray[index].vidIndex + boxInView -1;
            if( destroyVid < rowArray[index].length ){
                movePixels = "+=" + boxWidth + "px";

                $("#row"+index).animate({
                    left: movePixels 
                },aniTIme,function(){
                    movePixels = -boxWidth ;
                    if(checkIfCreateDestroy(categoryIndex),"left"){
                        $("#row"+index).css("left", movePixels+"px");
                        createDestroy(categoryIndex, "left");
                    }
                });
            }else{
                
               movePixels = "+=" + boxWidth + "px";
                if(rowArray[index].vidIndex == 0 ){
                    //createDestroy(categoryIndex, "left");
                    movePixels = -boxWidth + "px";
                }
                 $("#row"+index).animate({
                    left: movePixels 
                },aniTIme,function(){
                   
                });
            }
            
            
        }else{
            movePixels = boxWidth ;
            $("#row"+index).css("left", movePixels+"px");
        }
    }
    function moveRowUp(index, animation){
        if(categoryIndex + 1 >= Data.list.length ){
           
            $("#rowCont").prepend( createRow( categoryIndex -1 ) );
            moveRowRight(categoryIndex -1 , false);
            $("#rowCont").animate({
                top: 0 
            },aniTIme,function(){  
            });
            categoryIndex--;
        }else{
            categoryIndex--;
            $("#rowCont").prepend( createRow( categoryIndex ) );
            $("#rowCont").css("top", "-"+rowHeight+"px");
            moveRowRight(categoryIndex, false);
            if(someFlag){
                someFlag = false;
                console.log("Especial case");
                moveRowFix();
            }
            if(animation){
                $("#rowCont").animate({
                    top: 0 
                },aniTIme,function(){
                    //$("#rowCont").find('div').last().remove();
                    $("#rowCont > div:last-child").remove();     
                });
            }else{

            }
        }
    }

    function moveRowDown(index, animation){
        
        categoryIndex++;
        if(categoryIndex + 1 < Data.list.length ){
            $("#rowCont").append( createRow( categoryIndex + 1) );
            moveRowRight(categoryIndex+ 1, false);

        }
        if(animation){
            $("#rowCont").animate({
                top: -rowHeight 
            },aniTIme,function(){
                $("#rowCont").find('div').first().remove();
                $("#rowCont").css("top", "0px");
            });
        }else{
        
        }
    }

    function moveRowFix(){
         var movePixels = -boxWidth*(rowArray[categoryIndex].vidIndex+1) ;
         $("#row"+categoryIndex).css("left", movePixels+"px");
    }
    function getShortText(title, length){
        var res = title;
        if(typeof title === 'undefined' || !title  || title == ""){
            res = "NO TEXT";
        }else if(title.length > length){
            res = title.substring(0, length) + "...";
        }
        return res;
    }
    function createRow( index ){
        var category = Data.list[index];
        
        var row = $("<div class='row' />");
        var rowHeader = $("<div class='rowHeader' />");
        var rowScrollCont = $("<div id='row"+ index +"' class='rowScrollCont'/>");
        var textRow = $("<span class='spanRowHead' />");
        var title = getShortText(rowArray[index].title , 40);
        textRow.text(title);
        rowHeader.append(textRow);
        //rowHeader.text(rowArray[index].title);
        row.append(rowHeader);
        //create the first row. 
        someFlag = false;
        if(boxInView < category.videos.length ){
            var videoBox;
            if( rowArray[index].vidIndex == 0 ){
                videoBox = createVideoBox(category.videos[category.videos.length-1], index, category.videos.length-10000);
            }else{
                videoBox = createVideoBox(category.videos[rowArray[index].vidIndex - 1], index, rowArray[index].vidIndex-1);
            }

            rowScrollCont.append(videoBox);
            // create the rest

            for(var i = rowArray[index].vidIndex ; i < rowArray[index].vidIndex + (boxInView -1) && i < category.videos.length ; i++){

                var videoBox = createVideoBox(category.videos[i], index, i);
                rowScrollCont.append(videoBox);
            }
        }else{
            var videoBox;
            videoBox = createVideoBox(category.videos[category.videos.length-1], index, category.videos.length-10000);

            rowScrollCont.append(videoBox);
            for(var i = 0 ; i <  category.videos.length ; i++){
                var videoBox = createVideoBox(category.videos[i], index, i);
                rowScrollCont.append(videoBox);
            }
        
            someFlag = true;
/*          for(var i = rowArray[index].vidIndex ; i < rowArray[index].vidIndex + (boxInView -1) && i < category.videos.length ; i++){

                var videoBox = createVideoBox(category.videos[i], index, i);
                rowScrollCont.append(videoBox);
            }*/
            
        }
        row.append(rowScrollCont);
        return row;
    }
    
    function createVideoBox(video, catIndex, vidIndex){
        var videoBoxCont = $("<div id='cat"+catIndex+"vid"+vidIndex+"' class='rowContentCont' />");
        var videoBox = $("<div class='vidBox' />");
        //var vidImage = $("<div class='vidImage' />");
        var vidImage = $("<img class='vidImage' />");
        var iconHolder = $("<div class='iconHolder' />")
        var vidInfoCont = $("<div class='vidInfoCont' />");
        var vidName = $("<div class='vidName' />");
        vidName.css("border-top", "solid 3px " + rowArray[catIndex].color)
        //vidInfoCont.css("background-color", rowArray[catIndex].color);
        vidInfoCont.css("background-color", "#9E9E9E");
        if(vidIndex >= 0 ){ // negative values
            vidName.html(getShortText(video.name,42));
            vidImage.attr('src', video.thumbnail );
        }
        vidInfoCont.append(vidName);
        
        videoBox.append(vidImage);
        videoBox.append(iconHolder);
        videoBox.append(vidInfoCont);
        
        videoBoxCont.append(videoBox);
        
        return videoBoxCont;
    }

function addSelectedTo(catind){
    $(".selectedVid").removeClass("selectedVid");
    var vidInd = rowArray[catind].vidIndex;
    $("#cat"+catind+"vid"+vidInd).addClass("selectedVid");
}

    function getColor(index){
        var i = index % 12;
        var color = ['#E57373','#F48FB1','#CE93D8',
                     '#B39DDB','#9FA8DA','#42A5F5',
                     '#03A9F4','#00ACC1','#26A69A',
                     '#4CAF50','#7CB342', '#9E9D24'];
        return color[i];
    }
    
    function SceneText(language_id) {
		language.current = language_id || language.current;
	}
    
    function rowClass(title, color, postion, numberInIndex, length){
        this.color=color; 
        this.vidIndex= postion; 
        this.catIndex = numberInIndex; 
        this.length = length;
        this.title=title; 
        this.id ="row"+numberInIndex;
        this.moreLeft = false;
        this.moreRight = false;
        var greatView = false;
        if(length > boxInView -2){
            greatView = true;
            moreLeft = false;
            moreRight = true;
        }
        this.graterThanView= greatView;
        return this;
    }
    
//})();
