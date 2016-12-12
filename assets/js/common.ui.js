/*
* CMS Common UI
* @module UI
*/
var UI;

(function($) {

  'use strict';

  //클라이언트 브라우져의 ie 8 여부 판단 하여 body에 .ie8부여
  if (navigator.appVersion.split('MSIE')[1]) {
    var IEversion = parseFloat(navigator.appVersion.split('MSIE')[1].split(';')[0].split(' ').join(''));

    if(IEversion <= 8.0){
       $('body').addClass('ie8');
    }
  }

  //브라우져 윈도우 객체 캐쉬
  var $w = $(window),

  //클라이언트의 모바일 환경여부 확인
  isMobileDevice = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobileDevice.Android() || isMobileDevice.BlackBerry() || isMobileDevice.iOS() || isMobileDevice.Opera() || isMobileDevice.Windows());
    }
  },
  isMobile = isMobileDevice.any(),

  //클라이언트가 모바일 환경일 경우 body에 .mobile 부여
  addIsMobileClass = (function() {
    if (isMobile) {
      $('body').addClass('mobile');
    }
  })(),

  //클라이언트가 iOS일 경우 body에 .ios 부여
  isIOS = (function() {
    if ((navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/iPad/i)
     || navigator.userAgent.match(/iPod/i)) == null) {
      return false;
    } else {
      $('body').addClass('ios');
      $('iframe').parent().css({
        '-webkit-overflow-scrolling': 'touch',
        'overflow-y':'scroll'
      })
      return true;
    }
  })(),

  //data attr 체크용 헬퍼함수
  hasDataAttr = function (ctx,func) {
    if ($(ctx).length) {
      var $ctx = $(ctx);
      if (func !== undefined) {
        func($ctx);  
      } else {
        console.log('callback function is not defined.');
      }
    }
  },

  fn = {

    watermark: function () {
      $('body').prepend('<div class="watermark"></div>');
    },

    //크로스 브라우징 폴리필
    polyfill : function() {

      //fireFox브라우져에서 keyup 이벤트 작동를 발생시킴.
      var keyUpTrigger = function () {

        $('[data-auto-complete]').each(function() {
          var $this = $(this);
          $this[0].checkKeyEvt = undefined;
          $this[0].existValue = undefined;
        });

        $('[data-auto-complete]').on('focus blur',function(e) {

          var $this = $(this);

          var watcher = function() {
            if($this[0].existValue != $this.val()) {
             $this.trigger('keyup');
            }
            $this[0].existValue = $this.val();
            if($this[0].checkKeyEvt) clearInterval($this[0].checkKeyEvt);
            $this[0].checkKeyEvt = setInterval(watcher, 100);
          };

          if (e.type == 'focus') {
            if(!$this[0].checkKeyEvt) watcher();
          } else if (e.type == 'blur') {
            if($this[0].checkKeyEvt) {
              clearInterval($this[0].checkKeyEvt);
              $this[0].checkKeyEvt = undefined;
            }
          }
        });

      };

      //(firefox에서만 동작)
      if(navigator.userAgent.indexOf('Firefox') > -1) {
        keyUpTrigger();
      }
    },

    //스크롤시 우측 하단에 나타나는 top버튼관련 
    toTop : function () {
      var $toTop = $('#to_top');
      
      $toTop.bind('click',function() {
        $w.scrollTop(0);
      });

      if($w.scrollTop() > 100 ) {
          $toTop.removeClass('hide');
        } else {
          $toTop.addClass('hide');
        }

      $w.bind('scroll',function() {
        var $this = $(this);
        if($this.scrollTop() > 100 ) {
          $toTop.removeClass('hide');
        } else {
          $toTop.addClass('hide');
        }
      });
    },

    //탭 동작 관련
    tab : function() {
      hasDataAttr('[data-tab-label]',function($ctx){
        $ctx.each(function() {
          var $this = $(this),
              dataObj = $this.data('tab-label'),
              $target = $('[data-tab="' + dataObj.target + '"]');

          if (dataObj.status == 'on') {
            $this.addClass('on');
            $target.addClass('unhide');  
          }
        });

        $('body').on('click','[data-tab-label]',function() {
          var $this = $(this),
              dataObj = $this.data('tab-label'),
              $target = $('[data-tab="' + dataObj.target + '"]');

          if($('[data-tab-name]').length) {
            $('[data-tab-name]').val($this.find('>a>em').text());
          }

          if ($this.hasClass('on')) { return; }

          $('[data-tab-group="' + dataObj.group + '"]')
            .find('[data-tab]')
            .removeClass('unhide');
          $target.addClass('unhide');

          $this
            .addClass('on')
            .siblings()
            .removeClass('on');

        });

      });
    },
    
    //토글(보이기/숨기기) 동작 관련
    toggle : function() {
      hasDataAttr('[data-toggle-label]',function($ctx){
        $ctx.each(function() {
          var $this = $(this),
              dataObj = $this.data('toggle-label'),
              $toggleTarget = $('[data-toggle-target="' + dataObj + '"]');

          $this.off('click').on('click',function() {
            if ($this.find('>em').text() == '취소') {
              $toggleTarget.hide();
              $('[data-toggle-label="'+dataObj+'"]').removeClass('expanded');
              return;
            }
            if ($this.hasClass('expanded')) {
              $toggleTarget.hide();
              $this.removeClass('expanded')
            } else {
              $toggleTarget.show();
              $this.addClass('expanded')
            }
            
          });
          
        });
      });
    },

    //첨부파일 리스트 보이기/숨기기 관련
    toggleAttachList : function() {
      hasDataAttr('[data-toggle-attach-list]',function($ctx){
        $ctx.each(function() {
          var $this = $(this),
              dataObj = $this.data('toggle-attach-list'),
              $toggleTarget = $('[data-attach-list="' + dataObj + '"]'),
              $closeBtn = $toggleTarget.find('button.close');

          $this.on('click',function(e) {
            $toggleTarget.show();
          });

          $closeBtn.on('click',function() {
            $toggleTarget.hide();
          }); 
        });
      });
    },

    //통함검색 유사검색어 더보기/접기 관련
    toggleLinkList : function() {
      hasDataAttr('[data-toggle-link-list]',function($ctx){
        $ctx.each(function() {
          var $this = $(this),
              dataObj = $this.data('toggle-link-list'),
              $toggleTarget = $('[data-link-list="' + dataObj + '"]'),
              nlinkHeight = $toggleTarget.find('a').height();

          $this.on('click',function() {
            if ($this.hasClass('expanded')) {
              $this.removeClass('expanded')
              $toggleTarget.css('height',nlinkHeight+'px');
            } else {
              $this.addClass('expanded')
              
              $toggleTarget.css('height','auto');
            }
          });   
        });
      });
    },
    
    //팝업 등록화면 유용도 설문 라디오 버튼과 텍스트 필드 연동 관련
    relatedForm : function() {
      hasDataAttr('[data-related-form-label]',function($ctx){
        $ctx.each(function() {
          var $this = $(this),
              dataObj = $this.data('related-form-label'),
              $target = $('[data-related-form-target="' + dataObj.target + '"]');

          $this.on('click',function() {
            if (dataObj.way == 'radio-text') {
              if (dataObj.value === true && $this.prop('checked')) {
                $target.prop('disabled',false);
              }  
              
              if (dataObj.value === false && $this.prop('checked')) {
                $target.prop('disabled',true);
                $target.val('');
              }  
            }
          });
        });
      });
    },
    
    //팝업 등록화면 상세접기/상세보기 동작 콜백객체
    toggleAccordionCallBack: undefined,
    
    //팝업 등록화면 상세접기/상세보기 동작 관련
    toggleAccordion : function() {
      
      hasDataAttr('[data-toggle-accordion]',function($ctx){
        $ctx.each(function() {
          var $this = $(this),
              dataObj = $this.data('toggle-accordion'),
              $collapse = $('[data-toggle-accordion-collapse="' + dataObj.collapse + '"]'),
              nCollpaseHeight = $collapse.outerHeight(),
              $extend = $('[data-toggle-accordion-extend="' + dataObj.extend + '"]');
          
          if (dataObj.status == 'on') { 
            $extend.addClass('unhide')
            $this.addClass('folded');
          }
          
          $this.on('click',function() {
            if ($this.hasClass('folded')) {
              if (dataObj.isCollapseHide) {$collapse.show()}
              
              if (dataObj.justToggle) {
                $extend.each(function() {
                  
                  $(this).removeClass('unhide');
                });
              } else {
                $extend.each(function() {
                  $(this).removeClass('extended');
                  //$(this).height($(this).height() - nCollpaseHeight);
                });
              }
              
              $this.removeClass('folded');
              
              if (fn.toggleAccordionCallBack) {
                fn.toggleAccordionCallBack();
              }
            } else {
              $this.addClass('folded');
              if (dataObj.isCollapseHide) {$collapse.hide();}
              if (dataObj.justToggle) {
                $extend.each(function() {
                  $(this).addClass('unhide');
                });
              } else {
                $extend.each(function() {
                  $(this).addClass('extended');
                  //$(this).height($(this).height() + nCollpaseHeight);
                });
              }
              
              if (fn.toggleAccordionCallBack) {
                fn.toggleAccordionCallBack();
              }
            }
          });
        });
      });
    },
    
    //모달 팝업 관련
    modal : function() {
      var open = function(modalId) {
        var $modal = $('[data-modal="' + modalId + '"]'),
            zidx = 120;

        if (!$('.modal_backdrop').length) {
          $('body').prepend('<div class="modal_backdrop"></div>');
        }

        $('[data-modal].unhide').each(function() {
           zidx = Math.max(zidx, $(this).css('z-index')); 
           zidx++;
        });

        $modal.css('z-index',zidx);

        if ($modal.css('z-index') > 120) {
          $modal.addClass('layerd');
        }

        $modal.addClass('unhide');

        zidx = 120;
      } 

      var close = function(modalId) {
          var $modal = $('[data-modal="' + modalId + '"]'),
              isRemoveBackDrop = true;

          $modal.removeClass('unhide');  

          if ($modal.css('z-index') > 120) {
            $modal.removeClass('layerd');
          }

          $modal.css('z-index',120);

          $('[data-modal]').each(function() {
            if ($(this).hasClass('unhide')) {
                isRemoveBackDrop = false;
            }
          });

          if (isRemoveBackDrop) {
            $('.modal_backdrop').remove();
          }
      }

      $.fn.ctrlModal = function(action, modalId) {

          var $modal = $('[data-modal="' + modalId + '"]');

          if ($modal.length) {
            if (action == 'open') {
             open(modalId) 
            } else if (action == 'close') {
              close(modalId);
            }
          } 
      };

      hasDataAttr('[data-modal-label]',function($ctx){
        $ctx.each(function() {
        if ($(this).data('modal-visible')) {
          open($(this).data('modal-label'));
        } 
        });
      });

      $('body').on('click','[data-modal-label]',function($ctx){
          open($(this).data('modal-label'));
      });

      $('body').on('click','[data-modal-close]',function($ctx){
          close($(this).data('modal-close'));
      });

    },

    //체크박스 전체체크/해제 관련
    checkBoxAndRadio : function() {

      $('body').on('click','[data-check-all]',function(e) {

          var $input = $(this).find('input'),
            checkGroup = $(this).data('check-all');
            
          var val = $input.prop('checked'),
              bool;
          if (val) {
            bool = true;    
          } else {
            bool = false;  
          }

          $('[data-check-group="' + checkGroup + '"]').each(function() {
            $(this)
              .find('input')
              .prop('checked',bool);

          });

      });

      $('body').on('click','[data-check-group]',function(e) {

        var $input = $(this).find('input'),
              checkAll = $(this).data('check-group');

        $input.unbind('click').on('click',function() {

          $('[data-check-all="' + checkAll + '"]')
            .find('input')
            .prop('checked',false);

        });

      });

      //end - checkbox and radio
    },

    //폼요소 관련
    form : function () {
    
      //셀렉트 박스관련
      hasDataAttr('[data-select="true"]',function($ctx){
        $ctx.each(function() {
          var $wrapTag = $(this).parent().parent();
          if ($wrapTag[0].tagName == 'TD' || $wrapTag.tagName == 'TH') {
            $wrapTag.addClass('overflow');
          }
          $(this).selectOrDie();
        });
      });
      
      //datepicker관련
      hasDataAttr('[data-datepicker="true"]',function($ctx){
        $ctx.each(function() {
          //$(this).attr('readonly',true);
          $(this).datepicker({
            showButtonPanel: true,
            closeText: 'Close',
            dayNamesMin: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
            monthNames: ['년 1월','년 2월','년 3월','년 4월','년 5월','년 6월','년 7월','년 8월','년 9월','년 10월','년 11월','년 12월'],
            showOtherMonths: true,
            dateFormat: 'yy-mm-dd',
            showMonthAfterYear:true
          });
        });
      });

      /*
      $w.on('scroll',function(e) {
        if(isMobile && !isIOS) {
          $('[data-datepicker]').each(function() {
            $(this).datepicker('hide');
            $(this).blur();
          })
        }
      }); 

      $('body').on('focus','[data-datepicker]',function(e) {

        if(isMobile && !isIOS) {
           var $this = $(this),
            nPosThisTopEdge = $this[0].getBoundingClientRect().top,
            nPosThisLeftEdge = $this[0].getBoundingClientRect().left,
            $calendar = $('#ui-datepicker-div');
            
            $calendar.css({
              'position':'fixed',
              'top':$this.height()*2 + nPosThisTopEdge + 'px',
              'left':nPosThisLeftEdge + 'px'
            });
        }
      
      });
      */

    },

    //로딩 관련
    loading: function() {
      $.fn.ctrlLoading = function() {
          var  $this = $(this);
          console.log($this);
          if ($this.find('.loading_outer').length) {
            clearInterval($this[0].ctrlLoadingInterval);
            $this.find('.loading_outer').remove();
          } else {
              var tpl = '<div class="loading_outer"><div class="loading_inner"><div id="loading" class="loading-frame1"></div></div></div>',
                  frame = 8,
                  frameTime = parseInt(1000/frame)

              $this.css('position','relative');

              var $loading = $this.append(tpl).find('#loading');

              var changeFrameClass = function() {

                var curr = parseInt($loading.attr('class').replace('loading-frame',''));

                if (curr < frame) {
                  curr++;
                } else {
                  curr = 1;
                }
                $loading.attr('class','');
                $loading.addClass('loading-frame'+curr);
              }
              $this[0].ctrlLoadingInterval = setInterval(changeFrameClass,frameTime);
          }
      }  
    },

    //슬라이더 관련 (메인화면 우측 side 메뉴에 사용됨)
    slide: function() {
      hasDataAttr('[data-slide="v1"]',function($ctx){
        
        $ctx.each(function() {
          $(this).slick({
            infinite: false
          });
        });
        
      });
    },
    

    //메뉴 동작 관련
    menu : function() {
      
      //상단 헤더 GNB관련
      hasDataAttr('[data-menu="gnb"]',function($ctx){
        var $gnb = $ctx,
            $depth1List = $gnb.find('.depth1'),
            $depth2List = $gnb.find('.depth2'),
            $depth3List = $gnb.find('.depth3');

        $depth1List.addClass('col'+$depth1List.find('>li').length);
        $depth1List.append('<li class="no"><!--free space--></li>');

        
        
        var setDepth2ListWidth = function() {
          $depth2List
            .find('>ul')
            .each(function(){
              var $this = $(this);

              var nDepth2ListLiWidth = parseInt($depth1List.outerWidth() / 7);

              $this.find('>li>.depth3').each(function() {
                var $this = $(this);  
                $this.width(nDepth2ListLiWidth);
              }); 

              
              $this.closest('.depth2').width(((nDepth2ListLiWidth+1) * 7));
            }); 
          
        }; 
        
        var setDepth2Pos = function() {

          $depth1List
            .find('>li')
            .each(function(){
              if ($(this).hasClass('no')) {return;}
              
              var $this = $(this),
                  nPosThisLeftEdge = $this[0].getBoundingClientRect().left,
                  nPosDepth1ListRightEdge = $depth1List[0].getBoundingClientRect().right,
                  nDepth2ListWidth = $this.find('.depth2>ul').width();

              //set depth3's column height to equal to highest.
              $this.find('.depth2>ul').each(function() {

                var nDepth3HighestRow1 = 0;
                var nDepth3HighestRow2 = 0;
                var nDepth3HighestRow3 = 0;
                var $depth3 = $(this).find('>li>.depth3');

                $depth3.each(function(i){

                  if (i<7) {
                    nDepth3HighestRow1 = Math.max($(this).height(),nDepth3HighestRow1);
                  }

                  if (i>=7 && i<14) {
                    nDepth3HighestRow2 = Math.max($(this).height(),nDepth3HighestRow2);
                  }

                  if (i>=14 && i<21) {
                    nDepth3HighestRow3 = Math.max($(this).height(),nDepth3HighestRow3);
                  }


                });

                $depth3.each(function(i){

                  if (i<7) {
                    $(this).height(nDepth3HighestRow1);
                  }

                  if (i>=7 && i<14) {
                    $(this).height(nDepth3HighestRow2);
                  }

                  if (i>=14 && i<21) {
                    $(this).height(nDepth3HighestRow3);
                  }

                });

                //css로 잡은 최소 높이보다 클경우 높이값을 다시 정의한다.
                var $back = $(this).parent().find('.back');
                var nBackHeight = $back.height();

                var totalDepth2Height = nDepth3HighestRow1 + nDepth3HighestRow2 + nDepth3HighestRow3;
                if (totalDepth2Height > nBackHeight) {
                  totalDepth2Height += 14;//14는 여백값
                  $(this).height(totalDepth2Height);
                  $back.height(totalDepth2Height);
                }

              });
  
              //end

            var nDepth3Length =  $this.find('.depth3').length;
            var nDepth3Width;

            var nDepth2ListLiWidth = parseInt($depth1List.outerWidth() / 7);

            if (nDepth3Length<7) {
              nDepth3Width = (nDepth2ListLiWidth+1) * nDepth3Length + 1;
            } else {                  
              nDepth3Width = nDepth2ListWidth;
            }
            
            $this.find('.depth2').width(nDepth3Width);
            

            if (nPosDepth1ListRightEdge < (nPosThisLeftEdge + nDepth3Width)) {
              var $depth2List = $this.find('.depth2>ul'),
                  nPosDepth2ListRightEdge = $depth2List[0].getBoundingClientRect().right;

              if (nDepth3Length<7) {
                $this.find('.depth2').css('margin-left',
                nPosDepth1ListRightEdge - (nPosThisLeftEdge + nDepth3Width) + 'px');
              } else {
                $this.find('.depth2').css('margin-left',
                nPosDepth1ListRightEdge - (nPosThisLeftEdge + nDepth2ListWidth) + 'px');
              }

            }
  
          });
          
        }
        
        var setBack = function() {
          $depth2List.each(function(){
            var $this = $(this);
            var $back = $this.find('>.back');
            var nPosBackLeftEdge = $this[0].getBoundingClientRect().left;
            var nPosBackRightEdge = $this[0].getBoundingClientRect().right;
            $back.width($w.width());
            $back.css('margin-left',(( nPosBackLeftEdge) * -1) + 'px');
          });
        }
        
        //실제 동작 시점
        setDepth2ListWidth();
        setDepth2Pos();
        if (!isMobile) setBack();

        //리사이즈 될경우 재동작
        $(window).resize(function () {
          $gnb.find('.depth2').css('margin-left',0);
          setDepth2ListWidth();
          setDepth2Pos();
          if (!isMobile) setBack();
        });
        
        //iOS에서 포커스 아웃 발생용 폴리필
        if (isMobile && isIOS) {
          /* *for ipadAir2 trigger :hover bluring */
          $( '*' ).click( function ( ) { } );
          $( 'html' ).css( '-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)' );
        }
        
      });
      
      //좌측 LNB 동작 관련
      hasDataAttr('[data-menu="lnb"]',function($ctx){
        var $lnb = $ctx;

        $lnb
          .find('li')
          .each(function() {

            var $this = $(this),
                hasClz = ($this.parent())[0].className;

            if (!$this.children('ul').length) {
              $this.children('i').remove();
            }

            var bubbling = function($jqDom) {
              if ($jqDom.hasClass('lnb')) return;
              if ($jqDom[0].tagName == 'LI') $jqDom.addClass('on');
              bubbling($jqDom.parent());
            }
             if ($this.hasClass('on')) bubbling($this.parent());

          });
        
        $lnb
          .find('li')
          .click(function(e){
          
            var $this = $(this),
                hasClz = ($this.parent())[0].className;

            if ((hasClz == 'depth1' || hasClz == 'depth2') && $this.children('ul').length) {
              $this.toggleClass('on');
            }
            
            e.stopPropagation();
          });
      });

      //팝업 도움말화면 LNB관련
      hasDataAttr('[data-menu="lnb2"]',function($ctx){
        var $lnb = $ctx;
        
        $lnb
          .find('li')
          .click(function(e){
          
            var $this = $(this),
                hasClz = ($this.parent())[0].className;

            if (hasClz == 'depth1') {
              $this
                .toggleClass('on');
            } else if (hasClz == 'depth2') {
              $lnb
                .find('.depth2 li')
                .removeClass('on');
              $this
                .addClass('on');
            }
            
            e.stopPropagation();
          });
      });
    },
    
    //우측 사이드 메뉴 동작 관련
    aside : function() {
      hasDataAttr('[data-toggle-rnb="true"]',function($ctx){
        $ctx.click(function(){
          $('.aside').toggleClass('fold');
        });
      });
    },
    
    //.v2 클래쓰 테이블 의 TD안의 리스트가 길어지면 늘어날수 있도록 처리. (기본은 말줄임으로 처리)
    smallGroup : function() {
      hasDataAttr('.small_group_table',function($ctx){
        $ctx.each(function() {
          var $this = $(this);
          $this.parent().attr('style','white-space:normal !important;'); 
        });
      });
      
    },
    
    //탭 관리 중 순서변경 동작 관련
    tabOrderCtrl : function() {
      hasDataAttr('[data-tab-order]',function($ctx){
        $ctx.each(function() {
          var $prev = $(this).find('.prev'),
              $next = $(this).find('.next'),
              $tabOrderTarget = $('[data-tab-order-target="' + $(this).data('tab-order') + '"]');

          $prev.on('click',function() {
            var $onItem = $tabOrderTarget.find('>li.on');
            if ($onItem.prev().length) {
              $onItem.after($onItem.prev());
            } else {
              $onItem.detach().appendTo($tabOrderTarget);
            }
          });
          
          $next.on('click',function() {
            var $onItem = $tabOrderTarget.find('>li.on');
            if ($onItem.next().length) {
              $onItem.before($onItem.next());
            } else {
              $onItem.detach().prependTo($tabOrderTarget);
            }
          });    
        });
      });
    },

    //jstree 노드 순서 변경/전체 펼치기 동작관련
    treeNodeCtrl : function () {
      hasDataAttr('[data-node-ctrl]',function($ctx){
        $ctx.each(function() {
          var $this = $(this);
         

          $this.bind('click',function() {
            var dataObj = $this.data('node-ctrl');
            var treeId = '#' + dataObj.tree;
            var selectedNode = '#' + $(treeId).jstree('get_selected')[0];
            var parentNode = '#' + $(selectedNode).parent().parent().attr('id');
            var nodeLength = $(parentNode).find('>ul>li').length - 1;
            var selectedNodeIdx = 0;

            $(parentNode).find('>ul>li').each(function(i) {
              if($(this).attr('id') == $(treeId).jstree('get_selected')[0]) {
                selectedNodeIdx = i;
              }
            });

            if (dataObj.type == 'up') {
              if (selectedNodeIdx === 0 ) {
                return;
              }  else {
                $(treeId).jstree('move_node',selectedNode,parentNode,--selectedNodeIdx);
                console.log('up');
              }
            
            } else if (dataObj.type == 'down') {
              if (selectedNodeIdx === nodeLength ) {
                return;
              }  else {
                ++selectedNodeIdx;
                $(treeId).jstree('move_node',selectedNode,parentNode,++selectedNodeIdx);
                console.log('down');
                $(treeId).jstree('refrash');
              }
            } else if (dataObj.type == 'toggle') {
              if ($this.hasClass('expanded')) {
                $(treeId).jstree('close_all');
                $this.removeClass('expanded')
              } else {
                $(treeId).jstree('open_all');
                $this.addClass('expanded')
              }
            } 
          });

        });
      });
    },

    //관리자 메타 관리 메타명 추가 동작 관련
    inList : function() {
      hasDataAttr('[data-inlist]',function($ctx){
        $ctx.each(function() {
          var $this = $(this);
          var $field = $this.find('[data-inlist-field]');
          var $addBtn = $this.find('[data-inlist-add]');
          var $origin = $this.find('li.origin');
		  var $itemHtml = $('<li class="added"><input type="text" id="cntntsMetValNm" name="cntntsMetValNm"  class="admin_size8" maxlength="20"><button type="button" class="btn v2 grey size6">삭제</button></li>');

          $addBtn.on('click',function(e) {

            var nCurrRow = $this.find('>li').length-1;

            if (nCurrRow < 10) {
              var $cloneItemHhtml = $itemHtml.clone();
              $cloneItemHhtml.appendTo($this);

              $this
                .find('li.added>button')
                .unbind('click')
                .bind('click',function() {
                  cntntsMetValNm(this);
                });
            } else if (nCurrRow >= 10) {
              alert('메타 명은 최대 10개까지 등록 가능합니다.');
            }
          });
        });
      });

    },

    //팝업 즐겨찾기 전송 검색결과 -> 수신자 이동 동작 관련
    move : function() {

      $('body').on('click','[data-move-fromto]',function(e) {

        var $this = $(this);
        var thisDataObj = $this.data('move-fromto');

        if (thisDataObj.type == 'table_to_table1') {
          var $from = $('[data-move-from="' + thisDataObj.from + '"]');
          var $to = $('[data-move-to="' + thisDataObj.to + '"]');

          $from.find('tr.on>td:last-child').each(function() {
            var textToMove = $(this).text();
            var isNotAlreadyMoved = true;
            $to.find('tbody tr td:first-child').each(function() {
              if ($(this).text() == textToMove) {
                isNotAlreadyMoved = false;
              }
            });

            if (isNotAlreadyMoved) {
              var domToMove = '<tr><td class="'+ 'align_l">' + textToMove + '</td><td class="no_border_l"><button type="button" class="btn delete2"><i></i></button></td></tr>';

              $to.find('tbody').append(domToMove);
              
            }

            $(this).closest('tr').removeClass('on');
          });
        }
      });

      $('body').on('click','table.v4[data-move-from] tbody tr',function(e) {
        var $this = $(this);
        $this.toggleClass('on');
      });

      $('body').on('click','table.v4[data-move-to] button.delete2',function(e) {
        $(this).closest('tr').remove();
      });

    },

    //공지사항 리스트 라벨 카운트에 따라 클래쓰 부여 및 라벨 위치 조정
    tableListLabel: function() {
      var $hasLabels = $('table.v1>tbody>tr>td>.has_label');
      $hasLabels.each(function() {
        var $this = $(this);
        var labelCount = $this.children('span.label').length;
        if (labelCount > 1) {
          $this.addClass('label_count_'+labelCount);
        }
        $(this).attr('style','padding-right:'+ (labelCount * 33) + 'px');

        var nLabel = 1;
        $this.children('span.label').each(function() {
          $(this).addClass('order'+nLabel);
          $(this).attr('style','right:'+ ((labelCount - nLabel) * 33) + 'px');
          nLabel++;
        });
      });
    },

    regArea: function() {
      $('.reg_area').each(function() {
        $(this).closest('td').css({
          'height':'auto',
          'border-bottom':'none'
        })
      })
    },

    /*
    * initialize
    */
    init : function () {
      //fn.watermark();
      fn.checkBoxAndRadio();
      fn.form();
      fn.polyfill();
      fn.toTop(); 
      fn.modal();
      fn.tab();
      fn.loading();
      fn.slide();
      fn.menu();
      fn.aside();
      fn.toggle();
      fn.toggleAccordion(); 
      fn.relatedForm();
      fn.smallGroup();
      fn.tabOrderCtrl();
      fn.treeNodeCtrl();
      fn.inList();
      fn.toggleAttachList();
      fn.toggleLinkList();
      fn.tableListLabel();
      fn.regArea();
    }
  };

  UI = {
    fn : fn
  }

//$(document).ready(function() {
  UI.fn.init();
//});

})(jQuery);



