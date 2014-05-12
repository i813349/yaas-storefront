/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.checkout')
    .controller('CheckoutCtrl', [ '$scope', '$rootScope', '$location', '$anchorScroll', 'CartSvc', 'OrderSvc', 'cart', 'order',
        function ($scope, $rootScope, $location, $anchorScroll, CartSvc, OrderSvc, cart, order) {

        $rootScope.showCart = false;
        $scope.order = order;
        $scope.cart = cart;

        $scope.badEmailAddress = false;
        $scope.showPristineErrors = false;


        var Wiz = function(){
            this.step1Done = false;
            this.step2Done = false;
            this.step3Done = false;
            this.shipToSameAsBillTo = true;
        };

        $scope.wiz = new Wiz();

        $scope.billToDone = function (billToFormValid, form) {
            $scope.$broadcast('submitting:form', form);
            if(billToFormValid) {
                $scope.wiz.step1Done = true;
                $scope.showPristineErrors = false;
                if($scope.wiz.shipToSameAsBillTo){
                    $scope.setShipToSameAsBillTo();
                }

                // guarantee correct scrolling for mobile
                $location.hash('step2');
                $anchorScroll();
            } else {
                $scope.showPristineErrors = true;
            }
        };

        $scope.shipToDone = function (shipToFormValid, form) {
            $scope.$broadcast('submitting:form', form);
            // if the ship to form fields are hidden, angular considers them empty - work around that:
            if(shipToFormValid || $scope.wiz.shipToSameAsBillTo) {
                $scope.wiz.step2Done = true;
                $scope.showPristineErrors = false;
                // guarantee correct scrolling for mobile
                $location.hash('step3');
                $anchorScroll();
            } else {
                $scope.showPristineErrors = true;
            }
        };

        $scope.paymentDone = function (){
             $scope.wiz.step3Done = true;
            // guarantee correct scrolling for mobile
            $location.hash('step4');
            $anchorScroll();
        };

        $scope.editBillTo = function() {
            $scope.wiz.step1Done = false;
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
        };

        $scope.editShipTo = function() {
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
        };

        $scope.editPayment = function() {
            $scope.wiz.step3Done = false;
        };

        $scope.emailBlurred = function (isValid, isDirty) {
            if (isValid) {
                $scope.badEmailAddress = false;
            }
            else if (isDirty) {
                $scope.badEmailAddress = true;
            }
        };


        $scope.setShipToSameAsBillTo = function (){
            angular.copy($scope.order.billTo, $scope.order.shipTo);
        };

        $scope.placeOrder = function (formValid, form) {
            $scope.$broadcast('submitting:form', form);
            if (formValid) {
                // do again to ensure copy in full-screen mode
                if ($scope.wiz.shipToSameAsBillTo) {
                    $scope.setShipToSameAsBillTo();
                }
                OrderSvc.createOrder(cart);
                CartSvc.emptyCart();
            }  else {
                $scope.showPristineErrors = true;
            }
        };

    }]);
