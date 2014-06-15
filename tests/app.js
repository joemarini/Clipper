window.addEventListener("load", function (e) {
	window.addEventListener("paste", function (e) {
	    var clip = new Clipper(e);
	    e.preventDefault();
    
		document.querySelector("#txt1").value = "There are " + clip.countDataTypes() + " data formats on the clipboard\n";

		for (i=0; i< clip.countDataTypes(); i++) {
			document.querySelector("#txt1").value += clip.getType(i) + "\n";
		}
		
		if (clip.hasDataType("text/plain")) {
			document.querySelector("#txt1").value += clip.getData("text/plain") + "\n";
		}
		document.querySelector("#txt1").value += clip.getData("text/joe") + "\n";
	});
	
	window.addEventListener("copy", function(e) {
	    var clip = new Clipper(e);
	    e.preventDefault();
	    
	    var myObj = {
	      "prop1" : "some value",
	      "prop2" : 123,
	      "prop3" : [
	        "item1", "item2", 456, "item3"
	      ]
	    };
	    clip.setData(myObj);
    
		var myArr = [0,1,2,3,4,5];
		clip.setData(myArr);
		
		clip.setData(document.querySelector("#h1"),"text/element");
		
		document.querySelector("#txt1").value = "There are " + clip.countDataTypes() + " data formats on the clipboard\n";
		for (i=0; i< clip.countDataTypes(); i++) {
			document.querySelector("#txt1").value += clip.getType(i) + "\n";
		}
		
		if (clip.hasDataType("text/json")) {
			document.querySelector("#txt1").value += clip.getData("text/json") + "\n";
		}
		
	});
});