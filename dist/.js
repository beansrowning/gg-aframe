/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	AFRAME.registerSystem('data-binding', {
	  schema: {},
	  init: function () {
	    this.bindings = {};
	    this.sourceData = {};
	  },
	  updateData: function (x) {
	    const oldData = this.sourceData;
	    if (!Object.keys(x).every(y => Array.isArray(x[y]))) {
	      throw new Error('All data-binding data values must be arrays');
	    }
	    for (let binding in this.bindings) {
	      if (!AFRAME.utils.deepEqual(oldData[binding], x[binding])) {
	        // keeping the same array object that bound components point to
	        this.sourceData[binding].splice(0, undefined, ...x[binding]);
	        this.bindings[binding].forEach(dataComp => {
	          dataComp.publishUpdate();
	        });
	        delete x[binding]; // remove processed items
	      }
	    }
	    // any keys that aren't bound can just be reassigned
	    this.sourceData = AFRAME.utils.extend(this.sourceData, x);
	  },
	  bindData: function (bindee) {
	    const bindName = bindee.data;
	    if (!this.sourceData[bindName]) {
	      this.sourceData[bindName] = [];
	    }
	    if (this.bindings[bindName]) {
	      this.bindings[bindName].push(bindee);
	    } else {
	      this.bindings[bindName] = [bindee];
	    }
	    return this.sourceData[bindName];
	  },
	  unbindData: function (bindee) {
	    let pos = this.bindings[bindee.data].indexOf(bindee);
	    if (pos !== -1) {
	      this.bindings[bindee.data].splice(pos, 1);
	    }
	  }
	});

	AFRAME.registerComponent('data-binding', {
	  schema: { type: 'string' },
	  multiple: true,
	  init: function () {
	    this.boundData = null;
	  },
	  update: function (oldDat) {
	    this.boundData = this.system.bindData(this);
	  },
	  remove: function () {
	    this.system.unbindData(this);
	  },
	  publishUpdate: function () {
	    this.el.emit('data-changed');
	  }
	});


/***/ })
/******/ ]);