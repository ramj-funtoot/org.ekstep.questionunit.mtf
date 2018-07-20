/*
 * Plugin to create MTF question
 * @class org.ekstep.questionunitmtf:mtfQuestionFormController
 * Sachin<sachin.kumar@goodworklabs.com>
 */
angular.module('mtfApp', ['org.ekstep.question'])
  .controller('mtfQuestionFormController', ['$scope', '$rootScope', 'questionServices', function ($scope, $rootScope, $questionServices) {
    $scope.formVaild = false;
    $scope.indexCount = 4;
    $scope.mtfConfiguartion = {
      'questionConfig': {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      },
      'optionsConfig': [{
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }, {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }]
    };
    $scope.mtfFormData = {
      'question': {
        'text': '',
        'image': '',
        'audio': '',
        'hint': ''
      },
      'option': {
        'optionsLHS': [{
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 1
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 2
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 3
        }],
        'optionsRHS': [{
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 1
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 2
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 3
        }],
        'questionCount': 0
      }
    };
  $scope.indexPair = 4;
    $scope.questionMedia = {};
    $scope.optionsMedia = {
      'image': [],
      'audio': []
    };
    $scope.mtfFormData.media = [];
    $scope.editMedia = [];
  var questionInput = CKEDITOR.replace('mtfQuestion', {// eslint-disable-line no-undef
    customConfig: CKEDITOR.basePath + "config.js",// eslint-disable-line no-undef
    skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",// eslint-disable-line no-undef
    contentsCss: CKEDITOR.basePath + "contents.css"// eslint-disable-line no-undef
    });
    questionInput.on('change', function () {
      $scope.mtfFormData.question.text = this.getData();
    });
    questionInput.on('focus', function () {
      $scope.generateTelemetry({ type: 'TOUCH', id: 'input', target: { id: 'questionunit-mtf-question', ver: '', type: 'input' } })
    });
    angular.element('.innerScroll').on('scroll', function () {
      $scope.generateTelemetry({ type: 'SCROLL', id: 'form', target: { id: 'questionunit-mtf-form', ver: '', type: 'form' } })
    });
    $scope.init = function () {
      if (!ecEditor._.isUndefined($scope.questionEditData)) {
        var data = $scope.questionEditData.data;
        $scope.mtfFormData.question = data.question;
        $scope.mtfFormData.option = data.option;
        $scope.editMedia = $scope.questionEditData.media;
        if ($scope.mtfFormData.option.length < 3) {
          $scope.mtfFormData.option.splice(3, 1);
        }
      }
      $scope.$parent.$on('question:form:val', function (event) {
        if ($scope.formValidation()) {
          /*if dynamic question assign how many questions are create that count to $scope.mtfFormData.questionCount
          Or else assign 1*/
          $scope.mtfFormData.questionCount = 1;
          $scope.$emit('question:form:valid', $scope.mtfFormData);
        } else {
          $scope.$emit('question:form:inValid', $scope.mtfFormData);
        }
      })
    }
    $scope.addPair = function () {

      var optionLHS = {
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
      'index': $scope.indexPair
      };
      var optionRHS = {
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
      'mapIndex': $scope.indexPair++
      };
      if ($scope.mtfFormData.option.optionsLHS.length < 5) {
        $scope.mtfFormData.option.optionsLHS.push(optionLHS);
        $scope.mtfFormData.option.optionsRHS.push(optionRHS);
      }
    }
    //on click next the form validation function called
    $scope.formValidation = function() {
      console.log($scope.mtfFormData);
      var opSel = false;
      var valid = false;
      //check form valid and lhs should be more than 3
      var formValid = $scope.mtfForm.$valid && $scope.mtfFormData.option.optionsLHS.length > 2;
      $scope.submitted = true;
      if (formValid) {
        opSel = true;
        $scope.selLbl = 'success';
      } else {
        opSel = false;
        $scope.selLbl = 'error';
      }
      var tempArray = [];
      _.isEmpty($scope.questionMedia.image) ? 0 : tempArray.push($scope.questionMedia.image);
      _.isEmpty($scope.questionMedia.audio) ? 0 : tempArray.push($scope.questionMedia.audio);
      _.each($scope.optionsMedia.image, function (key, val) {
        tempArray.push(key);
      });
      _.each($scope.optionsMedia.audio, function (key, val) {
        tempArray.push(key);
      });
      var temp = tempArray.filter(function (element) {
        return element !== undefined;
      });
      $scope.editMedia = _.union($scope.editMedia, temp);
      $scope.mtfFormData.media = $scope.editMedia;
      console.log("Form data", $scope.mtfFormData);
      return (formValid && opSel) ? true : false;
    }
    return formConfig;
  }
  /**
   * delete the pair in mtf
   * @memberof org.ekstep.questionunit.mtf.horizontal_controller
   * @param {Integer} id data.
   */
    $scope.deletePair = function(id) {
      $scope.mtfFormData.option.optionsLHS.splice(id, 1);
      $scope.mtfFormData.option.optionsRHS.splice(id, 1);
      //}
    }
    $scope.addImage = function (id, type) {
      var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
      var mediaObject = {
        type: 'image',
        search_filter: {} // All composite keys except mediaType
      }
      //Defining the callback function of mediaObject before invoking asset browser
      mediaObject.callback = function (data) {
        var tempImage = {
          "id": Math.floor(Math.random() * 1000000000), // Unique identifier
          "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
          "assetId": data.assetMedia.id, // Asset identifier
          "type": "image", // Type of asset (image, audio, etc)
          "preload": false // true or false
        };

        if (id == 'q') {
          telemetryObject.target.id = 'questionunit-mtf-add-image';
          $scope.mtfFormData.question.image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.questionMedia.image = tempImage;
        } else if (type == 'LHS') {
          telemetryObject.target.id = 'questionunit-mtf-lhs-add-image';
          $scope.mtfFormData.option.optionsLHS[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.image[id] = tempImage;
        } else if (type == 'RHS') {
          telemetryObject.target.id = 'questionunit-mtf-rhs-add-image';
          $scope.mtfFormData.option.optionsRHS[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.image[id] = tempImage;
        }
      }
      $questionServices.invokeAssetBrowser(mediaObject);
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.addAudio = function (id, type) {
      var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
      var mediaObject = {
        type: 'audio',
        search_filter: {} // All composite keys except mediaType
      }
      //Defining the callback function of mediaObject before invoking asset browser
      mediaObject.callback = function (data) {
        var tempAudio = {
          "id": Math.floor(Math.random() * 1000000000), // Unique identifier
          "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
          "assetId": data.assetMedia.id, // Asset identifier
          "type": "audio", // Type of asset (image, audio, etc)
          "preload": false // true or false
        };
        if (id == 'q') {
          telemetryObject.target.id = 'questionunit-mtf-add-audio';
          $scope.mtfFormData.question.audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.questionMedia.audio = tempAudio;
        } else if (type == 'LHS') {
          telemetryObject.target.id = 'questionunit-mtf-lhs-add-audio';
          $scope.mtfFormData.option.optionsLHS[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.audio[id] = tempAudio;
        } else if (type == 'RHS') {
          telemetryObject.target.id = 'questionunit-mtf-rhs-add-audio';
          $scope.mtfFormData.option.optionsRHS[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.audio[id] = tempAudio;
        }
      }
      $questionServices.invokeAssetBrowser(mediaObject);
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.deleteImage = function (id, type) {
      var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
      if (id == 'q') {
        telemetryObject.target.id = 'questionunit-mtf-delete-image';
        $scope.mtfFormData.question.image = '';
        delete $scope.questionMedia.image;
      } else if (type == 'LHS') {
        telemetryObject.target.id = 'questionunit-mtf-lhs-delete-image';
        $scope.mtfFormData.option.optionsLHS[id].image = '';
        delete $scope.optionsMedia.image[id];
      } else if (type == 'RHS') {
        telemetryObject.target.id = 'questionunit-mtf-rhs-delete-imgae';
        $scope.mtfFormData.option.optionsRHS[id].image = '';
        delete $scope.optionsMedia.image[id];
      }
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.deleteAudio = function (id, type) {
      var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
      if (id == 'q') {
        telemetryObject.target.id = 'questionunit-mtf-delete-audio';
        $scope.isPlayingQ = false;
        $scope.mtfFormData.question.audio = '';
        delete $scope.questionMedia.audio;
      } else if (type == 'LHS') {
        telemetryObject.target.id = 'questionunit-mtf-lhs-delete-audio';
        $scope.mtfFormData.option.optionsLHS[id].audio = '';
        delete $scope.optionsMedia.audio[id];
      } else if (type == 'RHS') {
        telemetryObject.target.id = 'questionunit-mtf-rhs-delete-audio';
        $scope.mtfFormData.option.optionsRHS[id].audio = '';
        delete $scope.optionsMedia.audio[id];
      }
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.generateTelemetry = function (data) {
      var plugin = {
        "id": "org.ekstep.questionunit.mtf",
        "ver": "1.0"
      }
      data.form = 'question-creation-mtf-form';
      $questionServices.generateTelemetry(data);
    }
  }]);
//# sourceURL=horizontalMtf.js
