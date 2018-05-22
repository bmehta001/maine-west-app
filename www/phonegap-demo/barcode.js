/* 
 * 1D barcode generator
 * 
 * Copyright (c) 2017 Project Nayuki
 * All rights reserved. Contact Nayuki for licensing.
 * https://www.nayuki.io/page/1d-barcode-generator-javascript
 */

"use strict";

/*---- User interface functions ----*/

/*// Each function takes a text string and returns an array of 0s and 1s
var BARCODE_GENERATOR_FUNCTIONS = {
	"codabar"        : makeCodabarBarcode,
};
*/
// Initialize HTML elements
var canvasElem = document.getElementById("canvas");
if (canvasElem != null) {
    
} else {
  alert("THERE'S A PROBLEM!");
}

var graphics = canvasElem.getContext("2d");
    /**var feedbackText = document.createTextNode("");
    document.getElementById("feedback").appendChild(feedbackText);*/

    // Set form input event handlers
    document.getElementById("barcodeButton").onclick =  function() {
      generate();
      return false;
    };
   
    // The function is the one and only entry point from the HTML code.
    function generate() {

      // Try to generate barcode
      graphics.clearRect(0, 0, canvasElem.width, canvasElem.height);
      
      var barcode = makeCodabarBarcode(localStorage.myID);

      // Dimensions of canvas and new image
      var scale = 1;
      var padding = 25;  // Number of pixels on each of the four sides
      var width  = canvasElem.width  = barcode.length * scale + padding * 2;
      var height = canvasElem.height = 200 + padding * 2;
      
      // Create image and fill with opaque white color
      var image = graphics.createImageData(width, height);
      var pixels = image.data;  // An array of bytes in RGBA format
      for (var i = 0; i < pixels.length; i++)
        pixels[i] = 0xFF;
      
      // Draw barcode onto image and canvas
      for (var y = padding; y < height - padding; y++) {
        for (var i = 0, x = padding; i < barcode.length; i++) {
          for (var j = 0; j < scale; j++, x++) {
            var k = ((y * width) + x) * 4;
            pixels[k + 0] = pixels[k + 1] = pixels[k + 2] = barcode[i] * 255;  // Red, green, blue channels
          }
        }
      }
      graphics.putImageData(image, 0, 0);
    }


    /*---- Barcode generator functions ----*/
    // By convention, 0 means black and 1 means white

    // Codabar barcode
    function makeCodabarBarcode(s) {
      if (!/^[0-9$$\/:.+-]*$/.test(s))
        throw "Text must only contain allowed characters";
      
      // Parameters. The spec recommends that 2.25 <= wide/narrow <= 3.0
      var narrow = 2;
      var wide = 5;
      
      // Build barcode
      var table = {
        "0":"nnnnnww", "1":"nnnnwwn", "2":"nnnwnnw", "3":"wwnnnnn",
        "4":"nnwnnwn", "5":"wnnnnwn", "6":"nwnnnnw", "7":"nwnnwnn",
        "8":"nwwnnnn", "9":"wnnwnnn", "-":"nnnwwnn", "$":"nnwwnnn",
        ".":"wnwnwnn", "/":"wnwnnnw", ":":"wnnnwnw", "+":"nnwnwnw",
        "A":"nnwwnwn", "B":"nwnwnnw", "C":"nnnwnww", "D":"nnnwwwn",
      };
      s = "A" + s + "A";  // Start and stop symbols (can be A/B/C/D)
      var result = [];
      for (var i = 0; i < s.length; i++) {
          var code = table[s.charAt(i)] + "n";
          for (var j = 0, color = 0; j < code.length; j++, color ^= 1)
            appendRepeat(result, color, code.charAt(j) == "n" ? narrow : wide);
    }


      return result;
    }

    /*---- Shared utility functions ----*/

// e.g. array = []; appendRepeat(array, 1, 3); array equals [1,1,1].
function appendRepeat(arr, digit, rep) {
	for (var i = 0; i < rep; i++)
		arr.push(digit);
}