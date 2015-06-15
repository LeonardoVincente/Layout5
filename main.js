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
    var boxWidth = 252;
    var boxHeight = 135;
    var Data;
$(document).ready( function(){
	getData();
    
});

function getData(){
    $.getJSON( "app_272.json", function( data ) {
        Data = data;
        initLayout();
        iniBackAndLogo();
    });

    $("#leftBtn").click(function(){
        if(checkifValidSide(categoryIndex ,"left")){
            moveRowLeft(categoryIndex, true);
        }
    });
    $("#rightBtn").click(function(){
        if(checkifValidSide(categoryIndex ,"right")){
            moveRowRight(categoryIndex, true);
        }
    });
    $("#upBtn").click(function(){
        moveRowUp(categoryIndex, true);
    });
    $("#downBtn").click(function(){
        moveRowDown(categoryIndex, true);
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
            createRow( "layCont", 0);
            moveRowRight( 0 , false);
            if(Data.list.length > 1){
                createRow("layCont",  1);
                moveRowRight( 1 , false);
            }
            
        }else{
            //moveRowRight( 0 , true);
        }
    }
    
    function checkifValidSide(catIndex,  dir){
        
        if(dir=="left"){
            console.log("Row index "+ rowArray[catIndex].vidIndex);
            if(rowArray[catIndex].vidIndex -1 >= 0){
                console.log("it passed the test");
                rowArray[catIndex].vidIndex--;
                console.log("After rowIndex "+ rowArray[catIndex].vidIndex);
                return true;
            }
        }
        if(dir=="right"){
            if(rowArray[catIndex].vidIndex + 1 < rowArray[catIndex].length){
                rowArray[catIndex].vidIndex++;
                console.log("After rowIndex "+ rowArray[catIndex].vidIndex);
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
        if(dir=="left"){
            var category = Data.list[idRow];
            var iVid = rowArray[idRow].vidIndex -1;
            if(iVid < 0){  
                iVid  = rowArray[idRow].length-1;
            }
            var newBox = createVideoBox(category.videos[iVid], idRow);
            $("#row"+idRow).prepend(newBox);
            $("#row"+idRow+"> div:last-child").remove();          
        }

        if(dir=="right"){
            $("#row"+idRow).find('div').first().remove();
            var category = Data.list[idRow];
            var iVid = rowArray[idRow].vidIndex;
            var newBox = createVideoBox(category.videos[iVid], idRow);
            $("#row"+idRow).append(newBox);
        }

    }

    function moveRowRight(index, animation){
        var movePixels;
        if(animation){
            movePixels = "-=" + boxWidth + "px";
            $("#row"+index).animate({
                left: movePixels 
            },1000,function(){
                movePixels = -boxWidth ;
                if(checkIfCreateDestroy(categoryIndex,"right")){
                    $("#row"+index).css("left", movePixels+"px");
                    createDestroy(categoryIndex, "right");
                }
            });
        }else{
            movePixels = -boxWidth * (rowArray[index].vidIndex + 1);
            $("#row"+index).css("left", movePixels+"px");
        }
    }
    

    function moveRowLeft(index, animation){
        var movePixels;
        console.log("moveleft")
        if(animation){
            movePixels = "+=" + boxWidth + "px";
            $("#row"+index).animate({
                left: movePixels 
            },1000,function(){
                movePixels = -boxWidth ;
                if(checkIfCreateDestroy(categoryIndex),"left"){
                    $("#row"+index).css("left", movePixels+"px");
                    createDestroy(categoryIndex, "left");
                }
            });
        }else{
            movePixels = boxWidth * (rowArray[index].vidIndex + 1);
            $("#row"+index).css("left", movePixels+"px");
        }
    }
    function moveRowUp(index, animation){
        categoryIndex--;
    }

    function moveRowDown(index, animation){
        categoryIndex++;
    }


    
    function createRow(container, index ){
        var category = Data.list[index];
        var row = $("<div class='row' />");
        var rowHeader = $("<div class='rowHeader' />");
        var rowScrollCont = $("<div id='row"+ index +"' class='rowScrollCont'/>");
        
        row.append(rowHeader);
        //create the first row. 
        var videoBox = createVideoBox(category.videos[category.videos.length-1], index);
        rowScrollCont.append(videoBox);
        
        // create the rest
        for(var i = 0 ; i < boxInView -1 && i < category.videos.length ; i++){
            var videoBox = createVideoBox(category.videos[i], index);
            rowScrollCont.append(videoBox);
        }

        row.append(rowScrollCont);
        $("#"+container).append(row);
    }
    
    function createVideoBox(video, catIndex){
        var videoBoxCont = $("<div class='rowContentCont' />");
        var videoBox = $("<div class='vidBox' />");
        var vidImage = $("<div class='vidImage' />");
        var vidInfoCont = $("<div class='vidInfoCont' />");
        var vidName = $("<div class='vidName' />");
        
        vidInfoCont.css("background-color", rowArray[catIndex].color);
        vidName.html(video.name);
        
        vidInfoCont.append(vidName);
        
        videoBox.append(vidImage);
        videoBox.append(vidInfoCont);
        
        videoBoxCont.append(videoBox);
        
        return videoBoxCont;
    }

    function getColor(index){
        var i = index % 12;
        var color = ['#FFEBEE','#FCE4EC','#F3E5F5',
                     '#EDE7F6','#E8EAF6','#E3F2FD',
                     '#E1F5FE','#E0F7FA','#E0F2F1',
                     '#E8F5E9','#F1F8E9', '#F9FBE7'];
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
