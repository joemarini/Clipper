/**
 * Clipper -- a library for interacting with the clipboard via JavaScript
 * 
 * Simplifies working with the clipboard 
 * code located at github.com/joemarini/clipper
 * 
 * Copyright (c) 2013 Joe Marini
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * @author Joe Marini
 * @version 0.1
 */

"use strict";

/**
 * Clipper
 * 
 * Constructor function for the Clipper object. Takes a clipboard as
 * an argument, which comes from the onCopy or onPaste event
 */
var Clipper = function(oClipBoard) {
  if (!oClipBoard)
    throw new Error("No argument supplied to Clipper constructor");
    
  if (toString.call(oClipBoard) === "[object Event]" && oClipBoard.clipboardData) 
    this.clipBoard = oClipBoard.clipboardData;
  else if (toString.call(oClipBoard) == "[object Clipboard]")
    this.clipBoard = oClipBoard;
  else
    throw new Error("Object provided to Clipper was not a clipboard object");
};

/**
 * getData
 * 
 * @returns the clipboard contents represented by the strType parameter, or empty string
 */
Clipper.prototype.getData = function(strType) {
  var result;
  
  result = this.clipBoard.getData(strType);
  return result;
};

/**
 * setData
 * 
 * Places data on the clipboard. Can auto-convert objects and arrays to strings
 * before copying them to the clipboard.
 * 
 * @param objData the data to place on clipboard. Can be string, array, object
 * @param strType optional type string, defaults to "text/plain"
 */
Clipper.prototype.setData = function(objData, strType) {
  var type = strType || "text/plain";
  
  if (toString.call(objData) === "[object Object]") {
    // stringify the object before placing it on the clipboard as both
    // JSON and in whatever format the caller specified
    var str = JSON.stringify(objData);
    this.clipBoard.setData("text/json", str);
    this.clipBoard.setData(type, str);
  }
  else if (Array.isArray(objData)) {
    var str = JSON.stringify(objData);
    this.clipBoard.setData("text/json", str);
    this.clipBoard.setData(type, objData);
  }
  else if (objData && objData.nodeType) {
    if (objData.nodeType == 1) {
      var str;
      // copy the contents of a DOM node to the clipboard based on the type:
      // * for text/html, copy the innerHTML of the node
      // * for text/plain, copy the textContent of the node
      if (strType === "text/html") {
        str = objData.innerHTML;
      }
      else {
        str = objData.textContent;
      }
      this.clipBoard.setData(type, str);
    }
    else if (objData.nodeType == 3) {
      // element is a text element, get its text content
      str = objData.getTextContent();
      this.clipBoard.setData(type, str);
    }
  }
  else {
    this.clipBoard.setData(strType, objData);
  }
};

/**
 * countDataTypes
 * 
 * returns the number of data types currently in the clipboard
 * 
 * @returns {number} count of data types in clipboard
 */
Clipper.prototype.countDataTypes = function() {
  return this.clipBoard.types.length;
};

/**
 * getType
 * 
 * @param indx index of type on clipboard to retrieve
 * @returns {string} type string indicating content type at that index
 * @throws Out of range exception if indx <0 or > number of types on clipboard
 */
Clipper.prototype.getType = function (indx) {
  if (indx < 0 || indx > this.clipBoard.types.length)
    throw new Error ("Index out of range in Clipper.getType()");
    
  return this.clipBoard.types[indx];
};

/**
 * hasDataType
 * 
 * @param strType the desired data type (e.g. "text/plain")
 * @returns true if the clipboard has content in the desired type
 */
Clipper.prototype.hasDataType = function(strType) {
  if (strType === "") return false;
  
  for (var i=0; i<this.clipBoard.types.length; i++) {
    if (this.clipBoard.types[i] == strType)
      return true;
  }
  return false;
};
