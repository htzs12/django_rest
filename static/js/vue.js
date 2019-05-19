/ *！
 * Vue.js v2.6.10
 *（c）2014-2019 Evan You
 *根据MIT许可证发布。
 * /
（功能（全球，工厂）{
  typeof exports ==='object'&& typeof module！=='undefined'？module.exports = factory（）：
  typeof define ==='function'&& define.amd？define（工厂）：
  （global = global || self，global.Vue = factory（））;
}（this，function（）{'use strict';

  / * * /

  var emptyObject = Object.freeze（{}）;

  //由于这些帮助器在JS引擎中产生了更好的VM代码
  //显式和函数内联。
  function isUndef（v）{
    return v === undefined || v === null
  }

  function isDef（v）{
    return v！== undefined && v！== null
  }

  function isTrue（v）{
    return v === true
  }

  function isFalse（v）{
    return v === false
  }

  / **
   *检查值是否是原始的。
   * /
  function isPrimitive（value）{
    回来（
      typeof value ==='string'||
      typeof value ==='number'||
      // $ flow-disable-line
      typeof value ==='symbol'||
      typeof value ==='boolean'
    ）
  }

  / **
   *快速对象检查 - 这主要用于说明
   *当我们知道值时，来自原始值的对象
   *是符合JSON的类型。
   * /
  function isObject（obj）{
    return obj！== null && typeof obj ==='object'
  }

  / **
   *获取值的原始类型字符串，例如[object Object]。
   * /
  var _toString = Object.prototype.toString;

  function toRawType（value）{
    return _toString.call（value）.slice（8，-1）
  }

  / **
   *严格的对象类型检查。只返回true
   *用于纯JavaScript对象。
   * /
  function isPlainObject（obj）{
    return _toString.call（obj）==='[object Object]'
  }

  function isRegExp（v）{
    return _toString.call（v）==='[object RegExp]'
  }

  / **
   *检查val是否是有效的数组索引。
   * /
  function isValidArrayIndex（val）{
    var n = parseFloat（String（val））;
    return n> = 0 && Math.floor（n）=== n && isFinite（val）
  }

  function isPromise（val）{
    回来（
      isDef（val）&&
      typeof val.then ==='function'&&
      typeof val.catch ==='function'
    ）
  }

  / **
   *将值转换为实际呈现的字符串。
   * /
  function toString（val）{
    return val == null
      ？“”
      ：Array.isArray（val）|| （isPlainObject（val）&& val.toString === _toString）
        ？JSON.stringify（val，null，2）
        ：String（val）
  }

  / **
   *将输入值转换为持久性的数字。
   *如果转换失败，请返回原始字符串。
   * /
  function toNumber（val）{
    var n = parseFloat（val）;
    return isNaN（n）？瓦尔：n
  }

  / **
   *制作地图并返回检查是否有钥匙的功能
   *在那张地图上。
   * /
  函数makeMap（
    STR，
    expectsLowerCase
  ）{
    var map = Object.create（null）;
    var list = str.split（'，'）;
    for（var i = 0; i <list.length; i ++）{
      map [list [i]] = true;
    }
    return expectedLowerCase
      ？function（val）{return map [val.toLowerCase（）]; }
      ：function（val）{return map [val]; }
  }

  / **
   *检查标签是否为内置标签。
   * /
  var isBuiltInTag = makeMap（'slot，component'，true）;

  / **
   *检查属性是否为保留属性。
   * /
  var isReservedAttribute = makeMap（'key，ref，slot，slot-scope，is'）;

  / **
   *从数组中删除项目。
   * /
  function remove（arr，item）{
    if（arr.length）{
      var index = arr.indexOf（item）;
      if（index> -1）{
        return arr.splice（index，1）
      }
    }
  }

  / **
   *检查对象是否具有该属性。
   * /
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn（obj，key）{
    return hasOwnProperty.call（obj，key）
  }

  / **
   *创建纯函数的缓存版本。
   * /
  function cached（fn）{
    var cache = Object.create（null）;
    return（function cachedFn（str）{
      var hit = cache [str];
      返回命中|| （cache [str] = fn（str））
    }）
  }

  / **
   * Camelize连字符分隔的字符串。
   * /
  var camelizeRE = /  - （\ w）/ g;
  var camelize = cached（function（str）{
    return str.replace（camelizeRE，function（_，c）{return c？c.toUpperCase（）：'';}}）
  }）;

  / **
   *大写一个字符串。
   * /
  var capitalize = cached（function（str）{
    return str.charAt（0）.toUpperCase（）+ str.slice（1）
  }）;

  / **
   *连接camelCase字符串。
   * /
  var hyphenateRE = / \ B（[AZ]）/ g;
  var hyphenate = cached（function（str）{
    return str.replace（hyphenateRE，' -  $ 1'）。toLowerCase（）
  }）;

  / **
   *简单的绑定polyfill适用于不支持它的环境，
   *例如，PhantomJS 1.x. 从技术上讲，我们不再需要这个了
   *因为在大多数浏览器中，本机绑定现在足够高效。
   *但删除它将意味着破坏能够运行的代码
   * PhantomJS 1.x，因此必须保留以便向后兼容。
   * /

  / * istanbul忽略下一个* /
  function polyfillBind（fn，ctx）{
    function boundFn（a）{
      var l = arguments.length;
      回来
        ？l> 1
          ？fn.apply（ctx，arguments）
          ：fn.call（ctx，a）
        ：fn.call（ctx）
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind（fn，ctx）{
    return fn.bind（ctx）
  }

  var bind = Function.prototype.bind
    ？nativeBind
    ：polyfillBind;

  / **
   *将类似数组的对象转换为实数数组。
   * /
  function toArray（list，start）{
    start = start || 0;
    var i = list.length  -  start;
    var ret = new Array（i）;
    当我 - ） {
      ret [i] = list [i + start];
    }
    返回
  }

  / **
   *将属性混合到目标对象中。
   * /
  function extend（to，_from）{
    for（_中的var键）{
      至[key] = _from [key];
    }
    还给
  }

  / **
   *将对象数组合并为单个对象。
   * /
  function toObject（arr）{
    var res = {};
    for（var i = 0; i <arr.length; i ++）{
      if（arr [i]）{
        extend（res，arr [i]）;
      }
    }
    返回资源
  }

  / * eslint-disable no-unused-vars * /

  / **
   *不执行任何操作。
   * Stubbing args使Flow流畅，而不会留下无用的转换代码
   * with ... rest（https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/）。
   * /
  函数noop（a，b，c）{}

  / **
   *总是返回false。
   * /
  var no = function（a，b，c）{return false; };

  / * eslint-enable no-unused-vars * /

  / **
   *返回相同的值。
   * /
  var identity = function（_）{return _; };

  / **
   *生成包含编译器模块中的静态键的字符串。
   * /
  function genStaticKeys（modules）{
    return modules.reduce（function（keys，m）{
      return keys.concat（m.staticKeys || []）
    }，[]）。join（'，'）
  }

  / **
   *检查两个值是否相等 - 即
   *如果它们是普通物体，它们是否具有相同的形状？
   * /
  function looseEqual（a，b）{
    if（a === b）{return true}
    var isObjectA = isObject（a）;
    var isObjectB = isObject（b）;
    if（isObjectA && isObjectB）{
      尝试{
        var isArrayA = Array.isArray（a）;
        var isArrayB = Array.isArray（b）;
        if（isArrayA && isArrayB）{
          return a.length === b.length && a.every（function（e，i）{
            return looseEqual（e，b [i]）
          }）
        } else if（Dateof日期&& b instanceof Date）{
          return a.getTime（）=== b.getTime（）
        } else if（！isArrayA &&！isArrayB）{
          var keysA = Object.keys（a）;
          var keysB = Object.keys（b）;
          return keysA.length === keysB.length && keysA.every（function（key）{
            return looseEqual（a [key]，b [key]）
          }）
        } else {
          / * istanbul忽略下一个* /
          返回false
        }
      } catch（e）{
        / * istanbul忽略下一个* /
        返回false
      }
    } else if（！isObjectA &&！isObjectB）{
      return String（a）=== String（b）
    } else {
      返回false
    }
  }

  / **
   *返回松散相等值的第一个索引
   *在数组中找到（如果value是普通对象，则数组必须为
   *包含相同形状的对象），如果不存在则为-1。
   * /
  function looseIndexOf（arr，val）{
    for（var i = 0; i <arr.length; i ++）{
      if（looseEqual（arr [i]，val））{return i}
    }
    返回-1
  }

  / **
   *确保只调用一次函数。
   * /
  函数一次（fn）{
    var called = false;
    return function（）{
      if（！called）{
        叫=真;
        fn.apply（this，arguments）;
      }
    }
  }

  var SSR_ATTR ='data-server-rendered';

  var ASSET_TYPES = [
    '零件'，
    '指示'，
    '过滤'
  ]。

  var LIFECYCLE_HOOKS = [
    'beforeCreate'，
    “创造”，
    'beforeMount'，
    “安装”，
    “更新前”，
    '更新'，
    'beforeDestroy'，
    “毁”，
    '活性'，
    “停用”，
    'errorCaptured'，
    'serverPrefetch'
  ]。

  / * * /



  var config =（{
    / **
     *选项合并策略（用于core / util / options）
     * /
    // $ flow-disable-line
    optionMergeStrategies：Object.create（null），

    / **
     *是否抑制警告。
     * /
    沉默：虚假，

    / **
     *在启动时显示生产模式提示消息？
     * /
    productionTip：“开发”！=='生产'，

    / **
     *是否启用devtools
     * /
    devtools：“开发”！=='生产'，

    / **
     *是否记录性能
     * /
    表现：假，

    / **
     *观察者错误的错误处理程序
     * /
    errorHandler：null，

    / **
     *守望者的警告处理程序警告
     * /
    warnHandler：null，

    / **
     *忽略某些自定义元素
     * /
    ignoredElements：[]，

    / **
     * v-on的自定义用户密钥别名
     * /
    // $ flow-disable-line
    keyCodes：Object.create（null），

    / **
     *检查标签是否保留，以便不能注册为
     * 零件。这取决于平台，可能会被覆盖。
     * /
    isReservedTag：不，

    / **
     *检查属性是否保留，以便不能用作组件
     *道具。这取决于平台，可能会被覆盖。
     * /
    isReservedAttr：不，

    / **
     *检查标签是否是未知元素。
     *平台相关。
     * /
    isUnknownElement：不，

    / **
     *获取元素的命名空间
     * /
    getTagNamespace：noop，

    / **
     *解析特定平台的真实标签名称。
     * /
    parsePlatformTagName：identity，

    / **
     *检查属性是否必须使用属性绑定，例如值
     *平台相关。
     * /
    mustUseProp：不，

    / **
     *异步执行更新。旨在供Vue Test Utils使用
     *如果设置为false，这将显着降低性能。
     * /
    异步：是的，

    / **
     *因遗留原因而曝光
     * /
    _lifecycleHooks：LIFECYCLE_HOOKS
  }）;

  / * * /

  / **
   *用于解析html标签，组件名称和属性路径的unicode字母。
   *使用https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   *由于它冻结PhantomJS而跳过\ u10000- \ uEFFFF
   * /
  var unicodeRegExp = / a-zA-Z \ u00B7 \ u00C0- \ u00D6 \ u00D8- \ u00F6 \ u00F8- \ u037D \ u037F- \ u1FF \ u200C \ \ u200D \ u203F- \ u2040 \ u2070- \ u218F \ u2C00- \ u2FEF \ u3001- \ uD7FF \ uF900- \ uFDCF \ uFDF0- \ uFFFD /;

  / **
   *检查字符串是否以$或_开头
   * /
  function isReserved（str）{
    var c =（str +''）.charCodeAt（0）;
    返回c === 0x24 || c === 0x5F
  }

  / **
   *定义一个属性。
   * /
  函数def（obj，key，val，enumerable）{
    Object.defineProperty（obj，key，{
      价值：val，
      可枚举：!!可枚举，
      可写的：真的，
      可配置：true
    }）;
  }

  / **
   *解析简单路径。
   * /
  var bailRE = new RegExp（（“[^”+（unicodeRegExp.source）+“。$ _ \\ d]”））;
  function parsePath（path）{
    if（bailRE.test（path））{
      返回
    }
    var segments = path.split（'。'）;
    return函数（obj）{
      for（var i = 0; i <segments.length; i ++）{
        if（！obj）{return}
        obj = obj [segments [i]];
      }
      返回obj
    }
  }

  / * * /

  //我们可以使用__proto__吗？
  {}中的var hasProto ='__ proto__';

  //浏览器环境嗅探
  var inBrowser = typeof window！=='undefined';
  var inWeex = typeof WXEnvironment！=='undefined'&& !! WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase（）;
  var UA = inBrowser && window.navigator.userAgent.toLowerCase（）;
  var isIE = UA && /msie|trident/.test(UA）;
  var isIE9 = UA && UA.indexOf（'msie 9.0'）> 0;
  var isEdge = UA && UA.indexOf（'edge /'）> 0;
  var isAndroid =（UA && UA.indexOf（'android'）> 0）|| （weexPlatform ==='android'）;
  var isIOS =（UA && /iphone|ipad|ipod|ios/.test(UA））|| （weexPlatform ==='ios'）;
  var isChrome = UA && /chrome\/\d+/.test(UA)&&！isE​​dge;
  var isPhantomJS = UA && /phantomjs/.test(UA）;
  var isFF = UA && UA.match（/ firefox \ /（\ d +）/）;

  // Firefox在Object.prototype上有一个“监视”功能......
  var nativeWatch =（{}）。watch;

  var supportsPassive = false;
  if（inBrowser）{
    尝试{
      var opts = {};
      Object.defineProperty（opts，'passive'，（{
        get：function get（）{
          / * istanbul忽略下一个* /
          supportsPassive = true;
        }
      }））; // https://github.com/facebook/flow/issues/285
      window.addEventListener（'test-passive'，null，opts）;
    } catch（e）{}
  }

  //这需要懒惰，因为之前可能需要vue
  // vue-server-renderer可以设置VUE_ENV
  var _isServer;
  var isServerRendering = function（）{
    if（_isServer === undefined）{
      / *伊斯坦布尔忽略如果* /
      if（！inBrowser &&！inWeex && typeof global！=='undefined'）{
        //检测vue-server-renderer的存在并避免
        // Webpack填充过程
        _isServer = global ['process'] && global ['process']。env.VUE_ENV ==='server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  //检测devtools
  var devtools = inBrowser && window .__ VUE_DEVTOOLS_GLOBAL_HOOK__;

  / * istanbul忽略下一个* /
  function isNative（Ctor）{
    返回typeof Ctor ==='function'&& / native code / .test（Ctor.toString（））
  }

  var hasSymbol =
    typeof Symbol！=='undefined'&& isNative（Symbol）&&
    typeof Reflect！=='undefined'&& isNative（Reflect.ownKeys）;

  var _Set;
  / * istanbul忽略if * / // $ flow-disable-line
  if（typeof Set！=='undefined'&& isNative（Set））{
    //在可用时使用原生Set。
    _Set = Set;
  } else {
    //非标准的Set polyfill，仅适用于原始键。
    _Set = / * @ __ PURE __ * /（function（）{
      function Set（）{
        this.set = Object.create（null）;
      }
      Set.prototype.has = function has（key）{
        return this.set [key] === true
      };
      Set.prototype.add = function add（key）{
        this.set [key] = true;
      };
      Set.prototype.clear = function clear（）{
        this.set = Object.create（null）;
      };

      返回集;
    }（））;
  }

  / * * /

  var warn = noop;
  var tip = noop;
  var generateComponentTrace =（noop）; //解决流量检查问题
  var formatComponentName =（noop）;

  {
    var hasConsole = typeof console！=='undefined';
    var classifyRE = /（？：^ | [-_]）（\ w）/ g;
    var classify = function（str）{return str
      .replace（classifyRE，function（c）{return c.toUpperCase（）;}）
      .replace（/ [-_] / g，''）; };

    warn = function（msg，vm）{
      var trace = vm？generateComponentTrace（vm）：'';

      if（config.warnHandler）{
        config.warnHandler.call（null，msg，vm，trace）;
      } else if（hasConsole &&（！config.silent））{
        console.error（（“[Vue warn]：”+ msg + trace））;
      }
    };

    tip = function（msg，vm）{
      if（hasConsole &&（！config.silent））{
        console.warn（“[Vue tip]：”+ msg +（
          vm？generateComponentTrace（vm）：''
        ））;
      }
    };

    formatComponentName = function（vm，includeFile）{
      if（vm。$ root === vm）{
        返回'<Root>'
      }
      var options = typeof vm ==='function'&& vm.cid！= null
        ？vm.options
        ：vm._isVue
          ？vm。$ options || vm.constructor.options
          ：vm;
      var name = options.name || options._componentTag;
      var file = options .__ file;
      if（！name && file）{
        var match = file.match（/（[^ / \\] +）\。vue $ /）;
        name = match && match [1];
      }

      回来（
        （name？（“<”+（classify（name））+“>”）：“<Anonymous>”）+
        （file && includeFile！== false？（“at”+ file）：''）
      ）
    };

    var repeat = function（str，n）{
      var res ='';
      while（n）{
        if（n％2 === 1）{res + = str; }
        if（n> 1）{str + = str; }
        n >> = 1;
      }
      返回资源
    };

    generateComponentTrace = function（vm）{
      if（vm._isVue && vm。$ parent）{
        var tree = [];
        var currentRecursiveSequence = 0;
        while（vm）{
          if（tree.length> 0）{
            var last = tree [tree.length  -  1];
            if（last.constructor === vm.constructor）{
              currentRecursiveSequence ++;
              vm = vm。$ parent;
              继续
            } else if（currentRecursiveSequence> 0）{
              tree [tree.length  -  1] = [last，currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push（VM）;
          vm = vm。$ parent;
        }
        在\ n \ n'+树中返回'\ n \ nfound
          .map（function（vm，i）{return（“”+（i === 0？'--->'：repeat（''，5 + i * 2））+（Array.isArray（vm）
              ？（（formatComponentName（vm [0]））+“...（”+（vm [1]）+“递归调用”）
              ：formatComponentName（vm）））; }）
          。加入（ '\ n'）
      } else {
        return（“\ n \ n（找到”+（formatComponentName（vm））+“）”）
      }
    };
  }

  / * * /

  var uid = 0;

  / **
   dep是一个可以有多个的可观察对象
   *指令订阅它。
   * /
  var Dep = function Dep（）{
    this.id = uid ++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub（sub）{
    this.subs.push（分）;
  };

  Dep.prototype.removeSub = function removeSub（sub）{
    remove（this.subs，sub）;
  };

  Dep.prototype.depend = function depend（）{
    if（Dep.target）{
      Dep.target.addDep（本）;
    }
  };

  Dep.prototype.notify = function notify（）{
    //首先稳定订户列表
    var subs = this.subs.slice（）;
    if（！config.async）{
      如果没有运行异步，则// subs不在调度程序中排序
      //我们现在需要对它们进行排序，以确保它们正确无误
      //订单
      subs.sort（function（a，b）{return a.id  -  b.id;}）;
    }
    for（var i = 0，l = subs.length; i <l; i ++）{
      潜艇[I] .update（）;
    }
  };

  //正在评估的当前目标观察者。
  //这是全球唯一的，因为只有一个观察者
  //可以一次评估。
  Dep.target = null;
  var targetStack = [];

  function pushTarget（target）{
    targetStack.push（目标）;
    Dep.target = target;
  }

  function popTarget（）{
    targetStack.pop（）;
    Dep.target = targetStack [targetStack.length  -  1];
  }

  / * * /

  var VNode = function VNode（
    标签，
    数据，
    孩子，
    文本，
    榆树，
    背景下，
    componentOptions，
    asyncFactory
  ）{
    this.tag = tag;
    this.data = data;
    this.children =孩子;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = {child：{configurable：true}};

  // DEPRECATED：用于向后compat的componentInstance的别名。
  / * istanbul忽略下一个* /
  prototypeAccessors.child.get = function（）{
    return this.componentInstance
  };

  Object.defineProperties（VNode.prototype，prototypeAccessors）;

  var createEmptyVNode = function（text）{
    if（text === void 0）text ='';

    var node = new VNode（）;
    node.text = text;
    node.isComment = true;
    返回节点
  };

  function createTextVNode（val）{
    返回新的VNode（未定义，未定义，未定义，字符串（val））
  }

  //优化的浅克隆
  //用于静态节点和插槽节点，因为它们可以重复使用
  //多次渲染，克隆它们可以避免DOM操作依赖时的错误
  //在他们的榆树参考上。
  function cloneVNode（vnode）{
    var cloned = new VNode（
      vnode.tag，
      vnode.data，
      //＃7975
      //克隆children数组以避免在克隆时改变原始数据
      // 一个孩子。
      vnode.children && vnode.children.slice（），
      vnode.text，
      vnode.elm，
      vnode.context，
      vnode.componentOptions，
      vnode.asyncFactory
    ）;
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    返回克隆
  }

  / *
   *不输入检查此文件，因为流量不能很好地使用
   *动态访问Array原型上的方法
   * /

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create（arrayProto）;

  var methodsToPatch = [
    '推'，
    “流行”，
    '转移'，
    “不印字”，
    '拼接'，
    '分类'，
    '相反'
  ]。

  / **
   *拦截变异方法并发出事件
   * /
  methodsToPatch.forEach（function（method）{
    //缓存原始方法
    var original = arrayProto [method];
    def（arrayMethods，方法，函数mutator（）{
      var args = []，len = arguments.length;
      而（len--）args [len] =参数[len];

      var result = original.apply（this，args）;
      var ob = this .__ ob __;
      var插入;
      开关（方法）{
        案例'推'：
        案件'不合时宜'：
          inserted = args;
          打破
        案件'拼接'：
          inserted = args.slice（2）;
          打破
      }
      if（inserted）{ob.observeArray（inserted）; }
      //通知变更
      ob.dep.notify（）;
      返回结果
    }）;
  }）;

  / * * /

  var arrayKeys = Object.getOwnPropertyNames（arrayMethods）;

  / **
   *在某些情况下，我们可能希望禁用组件内部的观察
   *更新计算。
   * /
  var shouldObserve = true;

  function toggleObserving（value）{
    shouldObserve = value;
  }

  / **
   * Observer类附加到每个观察到的
   *对象。一旦附加，观察者就会转换目标
   *对象的属性键进入getter / setter
   *收集依赖关系并发送更新。
   * /
  var Observer = function Observer（value）{
    this.value = value;
    this.dep = new Dep（）;
    this.vmCount = 0;
    def（value，'__ ob__'，this）;
    if（Array.isArray（value））{
      if（hasProto）{
        protoAugment（value，arrayMethods）;
      } else {
        copyAugment（value，arrayMethods，arrayKeys）;
      }
      this.observeArray（值）;
    } else {
      this.walk（值）;
    }
  };

  / **
   *浏览所有属性并将其转换为
   * getter / setters。只应在调用时调用此方法
   *值类型是Object。
   * /
  Observer.prototype.walk = function walk（obj）{
    var keys = Object.keys（obj）;
    for（var i = 0; i <keys.length; i ++）{
      defineReactive $$ 1（obj，keys [i]）;
    }
  };

  / **
   *观察数组项目列表。
   * /
  Observer.prototype.observeArray = function observeArray（items）{
    for（var i = 0，l = items.length; i <l; i ++）{
      观察（项[I]）;
    }
  };

  //助手

  / **
   *通过拦截扩充目标对象或数组
   *使用__proto__的原型链
   * /
  function protoAugment（target，src）{
    / * eslint-disable no-proto * /
    target .__ proto__ = src;
    / * eslint-enable no-proto * /
  }

  / **
   *通过定义来扩充目标对象或数组
   *隐藏的属性。
   * /
  / * istanbul忽略下一个* /
  function copyAugment（target，src，keys）{
    for（var i = 0，l = keys.length; i <l; i ++）{
      var key = keys [i];
      def（target，key，src [key]）;
    }
  }

  / **
   *尝试为值创建观察者实例，
   *如果成功观察，则返回新观察者，
   *或现有观察者，如果价值已经有一个。
   * /
  function observe（value，asRootData）{
    if（！isObject（value）|| value instanceof VNode）{
      返回
    }
    var ob;
    if（hasOwn（value，'__ ob __）&& value .__ ob__ instanceof Observer）{
      ob = value .__ ob__;
    如果（
      shouldObserve &&
      ！isServerRendering（）&&
      （Array.isArray（value）|| isPlainObject（value））&&
      Object.isExtensible（value）&&
      ！value._isVue
    ）{
      ob = new Observer（value）;
    }
    if（asRootData && ob）{
      ob.vmCount ++;
    }
    返回ob
  }

  / **
   *在Object上定义反应属性。
   * /
  function defineReactive $$ 1（
    OBJ，
    键，
    VAL，
    customSetter，
    浅
  ）{
    var dep = new Dep（）;

    var property = Object.getOwnPropertyDescriptor（obj，key）;
    if（property && property.configurable === false）{
      返回
    }

    //迎合预定义的getter / setter
    var getter = property && property.get;
    var setter = property && property.set;
    if（（！getter || setter）&& arguments.length === 2）{
      val = obj [key];
    }

    var childOb =！shallow && observe（val）;
    Object.defineProperty（obj，key，{
      可枚举的：是的，
      可配置：true，
      get：function reactiveGetter（）{
        var value = getter？getter.call（obj）：val;
        if（Dep.target）{
          dep.depend（）;
          if（childOb）{
            childOb.dep.depend（）;
            if（Array.isArray（value））{
              dependArray（值）;
            }
          }
        }
        回报价值
      }，
      set：function reactiveSetter（newVal）{
        var value = getter？getter.call（obj）：val;
        / * eslint-disable no-self-compare * /
        if（newVal === value ||（newVal！== newVal && value！== value））{
          返回
        }
        / * eslint-enable no-self-compare * /
        if（customSetter）{
          customSetter（）;
        }
        //＃7981：对于没有setter的访问者属性
        if（getter &&！setter）{return}
        if（setter）{
          setter.call（obj，newVal）;
        } else {
          val = newVal;
        }
        childOb =！shallow && observe（newVal）;
        dep.notify（）;
      }
    }）;
  }

  / **
   *在对象上设置属性。添加新属性和
   *如果财产没有，则触发更改通知
   * 已经存在。
   * /
  函数集（target，key，val）{
    if（isUndef（target）|| isPrimitive（target）
    ）{
      warn（（“无法在undefined，null或原始值上设置反应属性：”+（（target））））;
    }
    if（Array.isArray（target）&& isValidArrayIndex（key））{
      target.length = Math.max（target.length，key）;
      target.splice（key，1，val）;
      返回val
    }
    if（键入目标&&！（键入Object.prototype））{
      target [key] = val;
      返回val
    }
    var ob =（target）.__ ob __;
    if（target._isVue ||（ob && ob.vmCount））{
      警告（
        '避免将反应属性添加到Vue实例或其根$ data'+
        '在运行时 - 在数据选项中预先声明它。
      ）;
      返回val
    }
    if（！ob）{
      target [key] = val;
      返回val
    }
    defineReactive $$ 1（ob.value，key，val）;
    ob.dep.notify（）;
    返回val
  }

  / **
   *删除属性并在必要时触发更改。
   * /
  function del（target，key）{
    if（isUndef（target）|| isPrimitive（target）
    ）{
      warn（（“无法删除未定义，空值或原始值的反应属性：”+（（target））））;
    }
    if（Array.isArray（target）&& isValidArrayIndex（key））{
      target.splice（key，1）;
      返回
    }
    var ob =（target）.__ ob __;
    if（target._isVue ||（ob && ob.vmCount））{
      警告（
        '避免删除Vue实例或其根$ data'+上的属性
        ' - 只需将其设置为null。
      ）;
      返回
    }
    if（！hasOwn（target，key））{
      返回
    }
    删除目标[key];
    if（！ob）{
      返回
    }
    ob.dep.notify（）;
  }

  / **
   *触摸数组时收集数组元素的依赖关系，因为
   *我们不能像属性getter一样拦截数组元素访问。
   * /
  function dependArray（value）{
    for（var e =（void 0），i = 0，l = value.length; i <l; i ++）{
      e =值[i];
      e && e .__ ob__ && e .__ ob __。dep.depend（）;
      if（Array.isArray（e））{
        dependArray（E）;
      }
    }
  }

  / * * /

  / **
   *选项覆盖策略是处理的功能
   *如何合并父选项值和子选项
   *值为最终值。
   * /
  var strats = config.optionMergeStrategies;

  / **
   *有限制的选项
   * /
  {
    strats.el = strats.propsData = function（parent，child，vm，key）{
      if（！vm）{
        警告（
          “option \”“+ key +”\“只能在实例”+中使用
          '使用`new`关键字创建。'
        ）;
      }
      return defaultStrat（parent，child）
    };
  }

  / **
   * Helper以递归方式将两个数据对象合并在一起。
   * /
  function mergeData（to，from）{
    if（！from）{return to}
    var key，toVal，fromVal;

    var keys = hasSymbol
      ？Reflect.ownKeys（从）
      ：Object.keys（from）;

    for（var i = 0; i <keys.length; i ++）{
      key = keys [i];
      //如果已经观察到对象......
      if（key ==='__ ob__'）{continue}
      toVal = to [key];
      fromVal = from [key];
      if（！hasOwn（to，key））{
        set（to，key，fromVal）;
      如果（
        toVal！== fromVal &&
        isPlainObject（toVal）&&
        isPlainObject（fromVal）
      ）{
        mergeData（toVal，fromVal）;
      }
    }
    还给
  }

  / **
   *数据
   * /
  function mergeDataOrFn（
    parentVal，
    childVal，
    VM
  ）{
    if（！vm）{
      //在Vue.extend合并中，两者都应该是函数
      if（！childVal）{
        返回parentVal
      }
      if（！parentVal）{
        返回childVal
      }
      //当parentVal和childVal都存在时，
      //我们需要返回一个返回的函数
      //合并两个函数的结果......不需要
      //检查parentVal是否是函数，因为
      //它必须是传递先前合并的函数。
      return function mergedDataFn（）{
        return mergeData（
          typeof childVal ==='function'？childVal.call（this，this）：childVal，
          typeof parentVal ==='function'？parentVal.call（this，this）：parentVal
        ）
      }
    } else {
      return function mergedInstanceDataFn（）{
        //实例合并
        var instanceData = typeof childVal ==='function'
          ？childVal.call（vm，vm）
          ：childVal;
        var defaultData = typeof parentVal ==='function'
          ？parentVal.call（vm，vm）
          ：parentVal;
        if（instanceData）{
          return mergeData（instanceData，defaultData）
        } else {
          返回defaultData
        }
      }
    }
  }

  strats.data = function（
    parentVal，
    childVal，
    VM
  ）{
    if（！vm）{
      if（childVal && typeof childVal！=='function'）{
        警告（
          '“数据”选项应该是一个函数'+
          '返回组件'+中的每个实例值
          '的定义。'，
          VM
        ）;

        返回parentVal
      }
      return mergeDataOrFn（parentVal，childVal）
    }

    return mergeDataOrFn（parentVal，childVal，vm）
  };

  / **
   *钩子和道具合并为数组。
   * /
  function mergeHook（
    parentVal，
    childVal
  ）{
    var res = childVal
      ？parentVal
        ？parentVal.concat（childVal）
        ：Array.isArray（childVal）
          ？childVal
          ：[childVal]
      ：parentVal;
    返回资源
      ？dedupeHooks（RES）
      ：res
  }

  function dedupeHooks（hooks）{
    var res = [];
    for（var i = 0; i <hooks.length; i ++）{
      if（res.indexOf（hooks [i]）=== -1）{
        res.push（挂钩[I]）;
      }
    }
    返回资源
  }

  LIFECYCLE_HOOKS.forEach（function（hook）{
    strats [hook] = mergeHook;
  }）;

  / **
   *资产
   *
   *当存在vm（实例创建）时，我们需要这样做
   *构造函数选项，实例之间的三向合并
   *选项和父选项。
   * /
  function mergeAssets（
    parentVal，
    childVal，
    VM，
    键
  ）{
    var res = Object.create（parentVal || null）;
    if（childVal）{
      assertObjectType（key，childVal，vm）;
      return extend（res，childVal）
    } else {
      返回资源
    }
  }

  ASSET_TYPES.forEach（function（type）{
    strats [type +'s'] = mergeAssets;
  }）;

  / **
   *观察者。
   *
   * Watchers哈希不应该覆盖一个
   *另一个，所以我们将它们合并为数组。
   * /
  strats.watch = function（
    parentVal，
    childVal，
    VM，
    键
  ）{
    //解决Firefox的Object.prototype.watch ...
    if（parentVal === nativeWatch）{parentVal = undefined; }
    if（childVal === nativeWatch）{childVal = undefined; }
    / *伊斯坦布尔忽略如果* /
    if（！childVal）{return Object.create（parentVal || null）}
    {
      assertObjectType（key，childVal，vm）;
    }
    if（！parentVal）{return childVal}
    var ret = {};
    extend（ret，parentVal）;
    for（varV $ child in ChildVal）{
      var parent = ret [key $ 1];
      var child = childVal [key $ 1];
      if（parent &&！Array.isArray（parent））{
        parent = [parent];
      }
      ret [key $ 1] =父母
        ？parent.concat（子）
        ：Array.isArray（孩子）？孩子：[孩子];
    }
    返回
  };

  / **
   *其他对象哈希。
   * /
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function（
    parentVal，
    childVal，
    VM，
    键
  ）{
    if（childVal &&“development”！=='production'）{
      assertObjectType（key，childVal，vm）;
    }
    if（！parentVal）{return childVal}
    var ret = Object.create（null）;
    extend（ret，parentVal）;
    if（childVal）{extend（ret，childVal）; }
    返回
  };
  strats.provide = mergeDataOrFn;

  / **
   *默认策略。
   * /
  var defaultStrat = function（parentVal，childVal）{
    return childVal === undefined
      ？parentVal
      ：childVal
  };

  / **
   *验证组件名称
   * /
  function checkComponents（options）{
    for（options.components中的var键）{
      validateComponentName（键）;
    }
  }

  function validateComponentName（name）{
    if（！new RegExp（（“^ [a-zA-Z] [\\  -  \\。0-9_”+（unicodeRegExp.source）+“] * $”））。test（name））{
      警告（
        '组件名称无效：“'+ name +'”。组件名称'+
        '应符合html5规范中的有效自定义元素名称。'
      ）;
    }
    if（isBuiltInTag（name）|| config.isReservedTag（name））{
      警告（
        '不要使用内置或保留的HTML元素作为组件'+
        'id：'+名字
      ）;
    }
  }

  / **
   *确保将所有道具选项语法规范化为
   *基于对象的格式。
   * /
  function normalizeProps（options，vm）{
    var props = options.props;
    if（！props）{return}
    var res = {};
    var i，val，name;
    if（Array.isArray（props））{
      i = props.length;
      当我 - ） {
        val = props [i];
        if（typeof val ==='string'）{
          name = camelize（val）;
          res [name] = {type：null};
        } else {
          警告（'使用数组语法时'必须是字符串。'）;
        }
      }
    } else if（isPlainObject（props））{
      for（在道具中使用var键）{
        val = props [key];
        name = camelize（key）;
        res [name] = isPlainObject（val）
          ？VAL
          ：{type：val};
      }
    } else {
      警告（
        “选项\”props \“的值无效：期望数组或对象，”+
        “但得到了”+（toRawType（props））+“。”，
        VM
      ）;
    }
    options.props = res;
  }

  / **
   *将所有注入标准化为基于对象的格式
   * /
  function normalizeInject（options，vm）{
    var inject = options.inject;
    if（！inject）{return}
    var normalized = options.inject = {};
    if（Array.isArray（inject））{
      for（var i = 0; i <inject.length; i ++）{
        normalized [inject [i]] = {from：inject [i]};
      }
    } else if（isPlainObject（inject））{
      for（注入中的var键）{
        var val = inject [key];
        normalized [key] = isPlainObject（val）
          ？extend（{from：key}，val）
          ：{from：val};
      }
    } else {
      警告（
        “选项\”inject \“的值无效：期望数组或对象，”+
        “但得到了”+（toRawType（inject））+“。”，
        VM
      ）;
    }
  }

  / **
   *将原始函数指令规范化为对象格式。
   * /
  function normalizeDirectives（options）{
    var dirs = options.directives;
    if（dirs）{
      for（var key in dirs）{
        var def $$ 1 = dirs [key];
        if（typeof def $$ 1 ==='function'）{
          dirs [key] = {bind：def $$ 1，update：def $$ 1};
        }
      }
    }
  }

  function assertObjectType（name，value，vm）{
    if（！isPlainObject（value））{
      警告（
        “选项\”“+名称+”\“的值无效：期望一个对象，”+
        “但得到了”+（toRawType（value））+“。”，
        VM
      ）;
    }
  }

  / **
   *将两个选项对象合并为一个新选项。
   *实例化和继承中使用的核心实用程序。
   * /
  function mergeOptions（
    父母，
    儿童，
    VM
  ）{
    {
      checkComponents（孩子）;
    }

    if（typeof child ==='function'）{
      child = child.options;
    }

    normalizeProps（child，vm）;
    normalizeInject（child，vm）;
    normalizeDirectives（孩子）;

    //对子选项应用extends和mixins，
    //但仅当它是原始选项对象时才是
    //另一个mergeOptions调用的结果。
    //只有合并的选项具有_base属性。
    if（！child._base）{
      if（child.extends）{
        parent = mergeOptions（parent，child.extends，vm）;
      }
      if（child.mixins）{
        for（var i = 0，l = child.mixins.length; i <l; i ++）{
          parent = mergeOptions（parent，child.mixins [i]，vm）;
        }
      }
    }

    var options = {};
    var键;
    for（父母的钥匙）{
      MERGEFIELD（键）;
    }
    for（key in child）{
      if（！hasOwn（parent，key））{
        MERGEFIELD（键）;
      }
    }
    function mergeField（key）{
      var strat = strats [key] || defaultStrat;
      options [key] = strat（parent [key]，child [key]，vm，key）;
    }
    返回选项
  }

  / **
   *解决资产问题。
   *使用此函数是因为子实例需要访问权限
   *到其祖先链中定义的资产。
   * /
  function resolveAsset（
    选项，
    类型，
    ID，
    warnMissing
  ）{
    / *伊斯坦布尔忽略如果* /
    if（typeof id！=='string'）{
      返回
    }
    var assets = options [type];
    //首先检查本地注册变体
    if（hasOwn（assets，id））{return assets [id]}
    var camelizedId = camelize（id）;
    if（hasOwn（assets，camelizedId））{return assets [camelizedId]}
    var PascalCaseId = capitalize（camelizedId）;
    if（hasOwn（assets，PascalCaseId））{return assets [PascalCaseId]}
    //回退到原型链
    var res = assets [id] || 资产[camelizedId] || 资产[PascalCaseId];
    if（warnMissing &&！res）{
      警告（
        '无法解决'+ type.slice（0，-1）+'：'+ id，
        选项
      ）;
    }
    返回资源
  }

  / * * /



  function validateProp（
    键，
    propOptions，
    propsData，
    VM
  ）{
    var prop = propOptions [key];
    var absent =！hasOwn（propsData，key）;
    var value = propsData [key];
    //布尔铸造
    var booleanIndex = getTypeIndex（Boolean，prop.type）;
    if（booleanIndex> -1）{
      if（absent &&！hasOwn（prop，'default'））{
        value = false;
      } else if（value ===''|| value === hyphenate（key））{
        //只将空字符串/同名转换为boolean if
        //布尔值具有更高的优先级
        var stringIndex = getTypeIndex（String，prop.type）;
        if（stringIndex <0 || booleanIndex <stringIndex）{
          value = true;
        }
      }
    }
    //检查默认值
    if（value === undefined）{
      value = getPropDefaultValue（vm，prop，key）;
      //因为默认值是新副本，
      //一定要观察它
      var prevShouldObserve = shouldObserve;
      toggleObserving（真）;
      观察（值）;
      toggleObserving（prevShouldObserve）;
    }
    {
      assertProp（prop，key，value，vm，absent）;
    }
    回报价值
  }

  / **
   *获取道具的默认值。
   * /
  function getPropDefaultValue（vm，prop，key）{
    //没有默认值，返回undefined
    if（！hasOwn（prop，'default'））{
      返回undefined
    }
    var def = prop.default;
    //警告Object＆Array的非出厂默认值
    if（isObject（def））{
      警告（
        'prop''+ key +'“的默认值无效：'+
        '类型为Object / Array的道具必须使用工厂函数'+
        '返回默认值。'，
        VM
      ）;
    }
    //原始道具值也是从之前的渲染中未定义的，
    //返回先前的默认值以避免不必要的观察者触发器
    if（vm && vm。$ options.propsData &&
      vm。$ options.propsData [key] === undefined &&
      vm._props [key]！== undefined
    ）{
      return vm._props [key]
    }
    //为非函数类型调用工厂函数
    //如果函数的原型在不同的执行上下文中起作用，则值为Function
    return typeof def ==='function'&& getType（prop.type）！=='Function'
      ？def.call（VM）
      ：def
  }

  / **
   *断言道具是否有效。
   * /
  函数assertProp（
    支柱，
    名称，
    值，
    VM，
    缺席
  ）{
    if（prop.required && absent）{
      警告（
        '缺少必需的道具：''+ name +'“'，
        VM
      ）;
      返回
    }
    if（value == null &&！prop.required）{
      返回
    }
    var type = prop.type;
    var valid =！type || type === true;
    var expectedTypes = [];
    if（type）{
      if（！Array.isArray（type））{
        type = [type];
      }
      for（var i = 0; i <type.length &&！valid; i ++）{
        var assertedType = assertType（value，type [i]）;
        expectedTypes.push（assertedType.expectedType ||''）;
        valid = assertedType.valid;
      }
    }

    if（！valid）{
      警告（
        getInvalidTypeMessage（name，value，expectedTypes），
        VM
      ）;
      返回
    }
    var validator = prop.validator;
    if（验证者）{
      if（！validator（value））{
        警告（
          '无效道具：自定义验证器检查失败，因为道具“'+名称+'”。'，
          VM
        ）;
      }
    }
  }

  var simpleCheckRE = / ^（String | Number | Boolean | Function | Symbol）$ /;

  function assertType（value，type）{
    var有效;
    var expectedType = getType（type）;
    if（simpleCheckRE.test（expectedType））{
      var t = typeof value;
      valid = t === expectedType.toLowerCase（）;
      //用于原始包装器对象
      if（！valid && t ==='object'）{
        valid = value instanceof type;
      }
    } else if（expectedType ==='Object'）{
      valid = isPlainObject（value）;
    } else if（expectedType ==='Array'）{
      valid = Array.isArray（value）;
    } else {
      valid = value instanceof type;
    }
    返回{
      有效：有效，
      expectedType：expectedType
    }
  }

  / **
   *使用函数字符串名来检查内置类型，
   *因为运行时简单的相等检查会失败
   *跨越不同的vms / iframe。
   * /
  function getType（fn）{
    var match = fn && fn.toString（）。match（/ ^ \ s * function（\ w +）/）;
    回归比赛？匹配[1]：''
  }

  function isSameType（a，b）{
    return getType（a）=== getType（b）
  }

  function getTypeIndex（type，expectedTypes）{
    if（！Array.isArray（expectedTypes））{
      return isSameType（expectedTypes，type）？0：-1
    }
    for（var i = 0，len = expectedTypes.length; i <len; i ++）{
      if（isSameType（expectedTypes [i]，type））{
        回来我
      }
    }
    返回-1
  }

  function getInvalidTypeMessage（name，value，expectedTypes）{
    var message =“无效道具：类型检查失败，对于道具\”“+名称+”\“。” +
      “预期”+（expectedTypes.map（大写）.join（'，'））;
    var expectedType = expectedTypes [0];
    var receivedType = toRawType（value）;
    var expectedValue = styleValue（value，expectedType）;
    var receivedValue = styleValue（value，receivedType）;
    //检查我们是否需要指定预期值
    if（expectedTypes.length === 1 &&
        isExplicable（expectedType）&&
        ！isBoolean（expectedType，receivedType））{
      message + =“with value”+ expectedValue;
    }
    消息+ =“，得到”+ receivedType +“”;
    //检查是否需要指定收到的值
    if（isExplicable（receivedType））{
      message + =“with value”+ receivedValue +“。”;
    }
    返回消息
  }

  function styleValue（value，type）{
    if（type ==='String'）{
      return（“\”“+ value +”\“”）
    } else if（type ==='Number'）{
      return（“”+（Number（value）））
    } else {
      return（“”+ value）
    }
  }

  function isExplicable（value）{
    var explicitTypes = ['string'，'number'，'boolean'];
    return explicitTypes.some（function（elem）{return value.toLowerCase（）=== elem;}）
  }

  function isBoolean（）{
    var args = []，len = arguments.length;
    而（len--）args [len] =参数[len];

    return args.some（function（elem）{return elem.toLowerCase（）==='boolean';}）
  }

  / * * /

  function handleError（err，vm，info）{
    //在处理错误处理程序时停用deps跟踪以避免可能的无限渲染。
    //请参阅：https：//github.com/vuejs/vuex/issues/1505
    pushTarget（）;
    尝试{
      if（vm）{
        var cur = vm;
        while（（cur = cur。$ parent））{
          var hooks = cur。$ options.errorCaptured;
          if（hooks）{
            for（var i = 0; i <hooks.length; i ++）{
              尝试{
                var capture = hooks [i] .call（cur，err，vm，info）=== false;
                if（capture）{return}
              } catch（e）{
                globalHandleError（e，cur，'errorCaptured hook'）;
              }
            }
          }
        }
      }
      globalHandleError（err，vm，info）;
    } finally {
      popTarget（）;
    }
  }

  function invokeWithErrorHandling（
    处理程序，
    背景下，
    ARGS，
    VM，
    信息
  ）{
    var res;
    尝试{
      res = args？handler.apply（context，args）：handler.call（context）;
      if（res &&！res._isVue && isPromise（res）&&！res._handled）{
        res.catch（function（e）{return handleError（e，vm，info +“（Promise / async）”）;}）;
        //问题＃9511
        //在嵌套调用时避免多次触发触发
        res._handled = true;
      }
    } catch（e）{
      handleError（e，vm，info）;
    }
    返回资源
  }

  function globalHandleError（err，vm，info）{
    if（config.errorHandler）{
      尝试{
        return config.errorHandler.call（null，err，vm，info）
      } catch（e）{
        //如果用户故意在处理程序中抛出原始错误，
        //不要记录两次
        if（e！== err）{
          logError（e，null，'config.errorHandler'）;
        }
      }
    }
    logError（错误，错误，信息）;
  }

  function logError（err，vm，info）{
    {
      警告（（“错误在”+ info +“：\”“+（err.toString（））+”\“”），vm）;
    }
    / * istanbul忽略其他* /
    if（（inBrowser || inWeex）&& typeof console！=='undefined'）{
      console.error（ERR）;
    } else {
      扔错了
    }
  }

  / * * /

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks（）{
    pending = false;
    var copies = callbacks.slice（0）;
    callbacks.length = 0;
    for（var i = 0; i <copies.length; i ++）{
      份[I]（）;
    }
  }

  //这里我们使用微任务来异步延迟包装器。
  //在2.5中我们使用（宏）任务（与微任务组合）。
  //但是，在重新绘制之前更改状态时，它会有细微的问题
  //（例如＃6813，out-in过渡）。
  //此外，在事件处理程序中使用（宏）任务会导致一些奇怪的行为
  //无法规避（例如＃7109，＃7153，＃7546，＃7834，＃8109）。
  //所以我们现在再次使用微任务。
  //这种权衡的一个主要缺点是存在一些情况
  //其中微任务具有太高的优先级，并且据称之间会发生火灾
  //顺序事件（例如＃4521，＃6690，有变通方法）
  //甚至在同一事件的冒泡之间（＃6566）。
  var timerFunc;

  // nextTick行为利用可以访问的微任务队列
  //通过原生Promise.then或MutationObserver。
  // MutationObserver有更广泛的支持，但是它被严重漏洞了
  //在触摸事件处理程序中触发时，iOS> = 9.3.3中的UIWebView。它
  //触发几次后完全停止工作......所以，如果是原生的话
  //承诺可用，我们将使用它：
  / * istanbul忽略next，$ flow-disable-line * /
  if（typeof Promise！=='undefined'&& isNative（Promise））{
    var p = Promise.resolve（）;
    timerFunc = function（）{
      p.then（flushCallbacks）;
      //在有问题的UIWebViews中，Promise.then并没有完全破坏，但是
      //它可能会陷入一种奇怪的状态，其中回调被推入
      //微任务队列但是队列没有被刷新，直到浏览器
      //需要做一些其他工作，例如处理计时器。因此我们可以
      //通过添加空计时器“强制”刷新微任务队列。
      if（isIOS）{setTimeout（noop）; }
    };
    isUsingMicroTask = true;
  } else if（！isIE && typeof MutationObserver！=='undefined'&&（
    isNative（MutationObserver）||
    // PhantomJS和iOS 7.x.
    MutationObserver.toString（）==='[object MutationObserverConstructor]'
  ））{
    //使用MutationObserver，其中本机Promise不可用，
    //例如PhantomJS，iOS7，Android 4.4
    //（＃6466 MutationObserver在IE11中不可靠）
    var counter = 1;
    var observer = new MutationObserver（flushCallbacks）;
    var textNode = document.createTextNode（String（counter））;
    observer.observe（textNode，{
      characterData：true
    }）;
    timerFunc = function（）{
      counter =（counter + 1）％2;
      textNode.data = String（counter）;
    };
    isUsingMicroTask = true;
  } else if（typeof setImmediate！=='undefined'&& isNative（setImmediate））{
    //回退到setImmediate。
    //技术上它利用（宏）任务队列，
    //但它仍然是比setTimeout更好的选择。
    timerFunc = function（）{
      setImmediate（flushCallbacks）;
    };
  } else {
    //回退到setTimeout。
    timerFunc = function（）{
      setTimeout（flushCallbacks，0）;
    };
  }

  function nextTick（cb，ctx）{
    var _resolve;
    callbacks.push（function（）{
      if（cb）{
        尝试{
          cb.call（CTX）;
        } catch（e）{
          handleError（e，ctx，'nextTick'）;
        }
      } else if（_resolve）{
        _resolve（CTX）;
      }
    }）;
    if（！pending）{
      pending = true;
      timerFunc（）;
    }
    // $ flow-disable-line
    if（！cb && typeof Promise！=='undefined'）{
      返回新的Promise（function（resolve）{
        _resolve = resolve;
      }）
    }
  }

  / * * /

  变量标记;
  变量;

  {
    var perf = inBrowser && window.performance;
    / *伊斯坦布尔忽略如果* /
    如果（
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ）{
      mark = function（tag）{return perf.mark（tag）; };
      measure = function（name，startTag，endTag）{
        perf.measure（name，startTag，endTag）;
        perf.clearMarks（STARTTAG）;
        perf.clearMarks（ENDTAG）;
        // perf.clearMeasures（名字）
      };
    }
  }

  / *不输入检查此文件，因为流程不能很好地与Proxy * /

  var initProxy;

  {
    var allowedGlobals = makeMap（
      'Infinity，undefined，NaN，isFinite，isNaN，'+
      'parseFloat，parseInt，decodeURI，decodeURIComponent，encodeURI，encodeURIComponent，'+
      '数学，数字，日期，数组，对象，布尔值，字符串，RegExp，地图，集，JSON，Intl，'+
      'require'//用于Webpack / Browserify
    ）;

    var warnNonPresent = function（target，key）{
      警告（
        “属性或方法\”“+键+”\“未在实例上定义，而是”+
        '在渲染期间引用。确保此属性具有反应性，'+
        '在数据选项中，或基于类的组件，由'+
        '初始化财产。'+
        '参见：https：//vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties。'，
        目标
      ）;
    };

    var warnReservedPrefix = function（target，key）{
      警告（
        “Property”“”+ key +“\”必须使用\“$ data。”+ key +“\”访问，因为“+”
        '以“$”或“_”开头的属性不会在Vue实例中代理为'+
        '防止与Vue内部冲突'+
        '参见：https：//vuejs.org/v2/api/#data'，
        目标
      ）;
    };

    var hasProxy =
      typeof Proxy！=='undefined'&& isNative（Proxy）;

    if（hasProxy）{
      var isBuiltInModifier = makeMap（'stop，prevent，self，ctrl，shift，alt，meta，exact'）;
      config.keyCodes = new Proxy（config.keyCodes，{
        set：function set（target，key，value）{
          if（isBuiltInModifier（key））{
            warn（（“避免覆盖config.keyCodes中的内置修饰符：。”+ key））;
            返回false
          } else {
            target [key] = value;
            返回true
          }
        }
      }）;
    }

    var hasHandler = {
      has：function has（target，key）{
        var has = key in target;
        var isAllowed = allowedGlobals（key）||
          （typeof key ==='string'&& key.charAt（0）==='_'&&！（key in target。$ data））;
        if（！has &&！isAllowed）{
          if（键入目标。$ data）{warnReservedPrefix（target，key）; }
          else {warnNonPresent（target，key）; }
        }
        返回有|| ！被允许
      }
    };

    var getHandler = {
      get：function get（target，key）{
        if（typeof key ==='string'&&！（key in target））{
          if（键入目标。$ data）{warnReservedPrefix（target，key）; }
          else {warnNonPresent（target，key）; }
        }
        返回目标[关键]
      }
    };

    initProxy = function initProxy（vm）{
      if（hasProxy）{
        //确定要使用的代理处理程序
        var options = vm。$ options;
        var handlers = options.render && options.render._withStripped
          ？getHandler
          ：hasHandler;
        vm._renderProxy = new Proxy（vm，handlers）;
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  / * * /

  var seenObjects = new _Set（）;

  / **
   *递归遍历一个对象以唤起所有转换
   * getters，使对象内的每个嵌套属性
   *被收集为“深层”依赖。
   * /
  function traverse（val）{
    _traverse（val，seenObjects）;
    seenObjects.clear（）;
  }

  function _traverse（val，seen）{
    var i，keys;
    var isA = Array.isArray（val）;
    if（（！isA &&！isObject（val））|| Object.isFrozen（val）|| val instanceof VNode）{
      返回
    }
    if（val .__ ob __）{
      var depId = val.__ob__.dep.id;
      if（seen.has（depId））{
        返回
      }
      seen.add（DEPID）;
    }
    if（isA）{
      i = val.length;
      while（i--）{_ _ traverse（val [i]，见过）; }
    } else {
      keys = Object.keys（val）;
      i = keys.length;
      while（i  - ）{_ _ traverse（val [keys [i]]，见过）; }
    }
  }

  / * * /

  var normalizeEvent = cached（function（name）{
    var passive = name.charAt（0）==='＆';
    名字=被动？name.slice（1）：name;
    var once $$ 1 = name.charAt（0）==='〜'; //最后一个前缀，先检查
    name =一次$$ 1？name.slice（1）：name;
    var capture = name.charAt（0）==='！';
    name = capture？name.slice（1）：name;
    返回{
      名称：名称，
      曾经：一次1美元，
      捕获：捕获，
      被动：被动
    }
  }）;

  function createFnInvoker（fns，vm）{
    function invoker（）{
      var参数$ 1 =参数;

      var fns = invoker.fns;
      if（Array.isArray（fns））{
        var cloned = fns.slice（）;
        for（var i = 0; i <cloned.length; i ++）{
          invokeWithErrorHandling（cloned [i]，null，arguments $ 1，vm，“v-on handler”）;
        }
      } else {
        //返回处理程序返回单个处理程序的值
        return invokeWithErrorHandling（fns，null，arguments，vm，“v-on handler”）
      }
    }
    invoker.fns = fns;
    返回调用者
  }

  function updateListeners（
    上，
    oldOn，
    加，
    删除$$ 1，
    createOnceHandler，
    VM
  ）{
    var name，def $$ 1，cur，old，event;
    for（name in on）{
      def $$ 1 = cur = on [name];
      old = oldOn [name];
      event = normalizeEvent（name）;
      if（isUndef（cur））{
        警告（
          “无效的事件处理程序\”“+（event.name）+”\“：得到”+ String（cur），
          VM
        ）;
      } else if（isUndef（old））{
        if（isUndef（cur.fns））{
          cur = on [name] = createFnInvoker（cur，vm）;
        }
        if（isTrue（event.once））{
          cur = on [name] = createOnceHandler（event.name，cur，event.capture）;
        }
        add（event.name，cur，event.capture，event.passive，event.params）;
      } else if（cur！== old）{
        old.fns = cur;
        在[name] = old;
      }
    }
    for（oldOn中的名字）{
      if（isUndef（on [name]））{
        event = normalizeEvent（name）;
        删除$$ 1（event.name，oldOn [name]，event.capture）;
      }
    }
  }

  / * * /

  function mergeVNodeHook（def，hookKey，hook）{
    if（def instanceof VNode）{
      def = def.data.hook || （def.data.hook = {}）;
    }
    var invoker;
    var oldHook = def [hookKey];

    function wrappedHook（）{
      hook.apply（this，arguments）;
      // important：删除merged hook以确保它只被调用一次
      //并防止内存泄漏
      remove（invoker.fns，wrappedHook）;
    }

    if（isUndef（oldHook））{
      //没有现有的钩子
      invoker = createFnInvoker（[wrappedHook]）;
    } else {
      / *伊斯坦布尔忽略如果* /
      if（isDef（oldHook.fns）&& isTrue（oldHook.merged））{
        //已经是合并的调用者
        invoker = oldHook;
        invoker.fns.push（wrappedHook）;
      } else {
        //现有的普通钩子
        invoker = createFnInvoker（[oldHook，wrappedHook]）;
      }
    }

    invoker.merged = true;
    def [hookKey] =调用者;
  }

  / * * /

  function extractPropsFromVNodeData（
    数据，
    构造函数，
    标签
  ）{
    //我们这里只提取原始值。
    //在子级中处理验证和默认值
    //组件本身。
    var propOptions = Ctor.options.props;
    if（isUndef（propOptions））{
      返回
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if（isDef（attrs）|| isDef（props））{
      for（propOptions中的var key）{
        var altKey =连字符（键）;
        {
          var keyInLowerCase = key.toLowerCase（）;
          如果（
            key！== keyInLowerCase &&
            attrs && hasOwn（attrs，keyInLowerCase）
          ）{
            小费（
              “Prop \”“+ keyInLowerCase +”\“传递给组件”+
              （formatComponentName（tag || Ctor））+“，但声明的prop名称是”+
              “\”“+键+”\“。”+
              “请注意，HTML属性不区分大小写并且基于camelCased”+
              “使用in-DOM时，道具需要使用他们的kebab-case等价物”+
              “模板。你应该使用\”“+ altKey +”\“而不是\”“+ key +”\“。”
            ）;
          }
        }
        checkProp（res，props，key，altKey，true）||
        checkProp（res，attrs，key，altKey，false）;
      }
    }
    返回资源
  }

  function checkProp（
    水库，
    哈希，
    键，
    ALT键，
    保留
  ）{
    if（isDef（hash））{
      if（hasOwn（hash，key））{
        res [key] = hash [key];
        if（！preserve）{
          delete hash [key];
        }
        返回true
      } else if（hasOwn（hash，altKey））{
        res [key] = hash [altKey];
        if（！preserve）{
          delete hash [altKey];
        }
        返回true
      }
    }
    返回false
  }

  / * * /

  //模板编译器尝试最小化规范化的需要
  //在编译时静态分析模板。
  //
  //对于纯HTML标记，可以完全跳过规范化，因为
  //生成的render函数保证返回Array <VNode>。有
  //需要额外规范化的两种情况：

  // 1.当孩子们包含组件时 - 因为功能组件
  //可能会返回一个数组而不是一个根。在这种情况下，只是一个简单的
  //需要规范化 - 如果任何子节点是数组，我们将整体展平
  //使用Array.prototype.concat的东西。它保证只有1级深
  //因为功能组件已经规范化了自己的孩子。
  function simpleNormalizeChildren（children）{
    for（var i = 0; i <children.length; i ++）{
      if（Array.isArray（children [i]））{
        return Array.prototype.concat.apply（[]，children）
      }
    }
    回来的孩子
  }

  // 2.当子项包含始终生成嵌套数组的构造时，
  //例如<template>，<slot>，v-for，或者当用户提供子项时
  //用手写的渲染函数/ JSX。在这种情况下完全正常化
  //需要满足所有可能类型的子值。
  function normalizeChildren（children）{
    return isPrimitive（儿童）
      ？[createTextVNode（儿童）]
      ：Array.isArray（儿童）
        ？normalizeArrayChildren（儿童）
        ：未定义
  }

  function isTextNode（node）{
    return isDef（node）&& isDef（node.text）&& isFalse（node.isComment）
  }

  function normalizeArrayChildren（children，nestedIndex）{
    var res = [];
    var i，c，lastIndex，last;
    for（i = 0; i <children.length; i ++）{
      c =儿童[i];
      if（isUndef（c）|| typeof c ==='boolean'）{continue}
      lastIndex = res.length  -  1;
      last = res [lastIndex];
      //嵌套
      if（Array.isArray（c））{
        if（c.length> 0）{
          c = normalizeArrayChildren（c，（（nestedIndex ||''）+“_”+ i））;
          //合并相邻的文本节点
          if（isTextNode（c [0]）&& isTextNode（last））{
            res [lastIndex] = createTextVNode（last.text +（c [0]）。text）;
            c.shift（）;
          }
          res.push.apply（res，c）;
        }
      } else if（isPrimitive（c））{
        if（isTextNode（last））{
          //合并相邻的文本节点
          //这对于SSR水合是必要的，因为文本节点是
          //在呈现为HTML字符串时基本上合并
          res [lastIndex] = createTextVNode（last.text + c）;
        } else if（c！==''）{
          //将原语转换为vnode
          res.push（createTextVNode（C））;
        }
      } else {
        if（isTextNode（c）&& isTextNode（last））{
          //合并相邻的文本节点
          res [lastIndex] = createTextVNode（last.text + c.text）;
        } else {
          //嵌套数组子项的默认键（可能由v-for生成）
          if（isTrue（children._isVList）&&
            isDef（c.tag）&&
            isUndef（c.key）&&
            isDef（nestedIndex））{
            c.key =“__ list”+ nestedIndex +“_”+ i +“__”;
          }
          res.push（C）;
        }
      }
    }
    返回资源
  }

  / * * /

  function initProvide（vm）{
    var provide = vm。$ options.provide;
    if（提供）{
      vm._provided = typeof提供==='功能'
        ？provide.call（VM）
        ：提供;
    }
  }

  function initInjections（vm）{
    var result = resolveInject（vm。$ options.inject，vm）;
    if（result）{
      toggleObserving（假）;
      Object.keys（result）.forEach（function（key）{
        / * istanbul忽略其他* /
        {
          defineReactive $$ 1（vm，key，result [key]，function（）{
            警告（
              “避免直接改变注入值，因为更改将是”+
              “只要提供的组件重新渲染，就会覆盖。”+
              “注射被突变：\”“+键+”\“”，
              VM
            ）;
          }）;
        }
      }）;
      toggleObserving（真）;
    }
  }

  function resolveInject（inject，vm）{
    if（inject）{
      // inject is：any因为flow不够聪明，无法计算出缓存
      var result = Object.create（null）;
      var keys = hasSymbol
        ？Reflect.ownKeys（注）
        ：Object.keys（inject）;

      for（var i = 0; i <keys.length; i ++）{
        var key = keys [i];
        //＃6574以防观察注射物体...
        if（key ==='__ ob__'）{continue}
        var provideKey = inject [key] .from;
        var source = vm;
        while（source）{
          if（source._provided && hasOwn（source._provided，provideKey））{
            result [key] = source._provided [provideKey];
            打破
          }
          source = source。$ parent;
        }
        if（！source）{
          if（注入[key]中的'default'）{
            var provideDefault = inject [key] .default;
            结果[key] = typeof provideDefault ==='function'
              ？provideDefault.call（VM）
              ：provideDefault;
          } else {
            警告（（“注射”“+ +键+”\“未找到”），vm）;
          }
        }
      }
      返回结果
    }
  }

  / * * /



  / **
   *运行时助手，用于将原始子VNode解析为槽对象。
   * /
  function resolveSlots（
    孩子，
    上下文
  ）{
    if（！children ||！children.length）{
      返回{}
    }
    var slots = {};
    for（var i = 0，l = children.length; i <l; i ++）{
      var child = children [i];
      var data = child.data;
      //如果节点被解析为Vue插槽节点，则删除slot属性
      if（data && data.attrs && data.attrs.slot）{
        删除data.attrs.slot;
      }
      //只有在vnode中呈现vnode时才应该尊重命名槽
      //相同的上下文。
      if（（child.context === context || child.fnContext === context）&&
        data && data.slot！= null
      ）{
        var name = data.slot;
        var slot =（slots [name] ||（slots [name] = []））;
        if（child.tag ==='template'）{
          slot.push.apply（slot，child.children || []）;
        } else {
          slot.push（孩子）;
        }
      } else {
        （slots.default ||（slots.default = []））。push（child）;
      }
    }
    //忽略只包含空格的插槽
    for（var名称$ 1 in slots）{
      if（slots [name $ 1] .every（isWhitespace））{
        删除插槽[name $ 1];
      }
    }
    返回插槽
  }

  function isWhitespace（node）{
    return（node.isComment &&！node.asyncFactory）|| node.text ===''
  }

  / * * /

  function normalizeScopedSlots（
    插槽，
    normalSlots，
    prevSlots
  ）{
    var res;
    var hasNormalSlots = Object.keys（normalSlots）.length> 0;
    var isStable = slots？!! slots。$ stable :! hasNormalSlots;
    var key = slots && slots。$ key;
    if（！slots）{
      res = {};
    } else if（slots._normalized）{
      //快速路径1：子组件仅重新渲染，父级没有更改
      return slots._normalized
    如果（
      isStable &&
      prevSlots &&
      prevSlots！== emptyObject &&
      key === prevSlots。$ key &&
      ！hasNormalSlots &&
      ！prevSlots。$ hasNormal
    ）{
      //快速路径2：稳定的作用域插槽没有正常的代理插槽，
      //只需要规范化一次
      返回prevSlots
    } else {
      res = {};
      for（var key $ 1 in slots）{
        if（slots [key $ 1] && key $ 1 [0]！=='$'）{
          res [key $ 1] = normalizeScopedSlot（normalSlots，key $ 1，slots [key $ 1]）;
        }
      }
    }
    //在scopedSlots上公开正常的槽
    for（var key $ 2 in normalSlots）{
      if（！（res中的密钥$ 2））{
        res [key $ 2] = proxyNormalSlot（normalSlots，key $ 2）;
      }
    }
    // avoriaz似乎模拟了一个不可扩展的$ scopedSlots对象
    //当传递它时会导致错误
    if（slots && Object.isExtensible（slots））{
      （槽）._ normalized = res;
    }
    def（res，'$ stable'，isStable）;
    def（res，'$ key'，key）;
    def（res，'$ hasNormal'，hasNormalSlots）;
    返回资源
  }

  function normalizeScopedSlot（normalSlots，key，fn）{
    var normalized = function（）{
      var res = arguments.length？fn.apply（null，arguments）：fn（{}）;
      res = res && typeof res ==='object'&&！Array.isArray（res）
        ？[res] //单个vnode
        ：normalizeChildren（res）;
      return res &&（
        res.length === 0 ||
        （res.length === 1 && res [0] .isComment）//＃9658
      ）？未定义
        ：res
    };
    //这是一个使用没有范围的新v-slot语法的插槽。虽然是
    //编译为作用域的槽，渲染fn用户希望它存在
    //在这个。$ slots上，因为用法在语义上是一个普通的插槽。
    if（fn.proxy）{
      Object.defineProperty（normalSlots，key，{
        得到：规范化，
        可枚举的：是的，
        可配置：true
      }）;
    }
    返回归一化
  }

  function proxyNormalSlot（slots，key）{
    return function（）{return slots [key]; }
  }

  / * * /

  / **
   *运行时助手，用于渲染v-for列表。
   * /
  function renderList（
    VAL，
    给予
  ）{
    var ret，i，l，keys，key;
    if（Array.isArray（val）|| typeof val ==='string'）{
      ret = new Array（val.length）;
      for（i = 0，l = val.length; i <l; i ++）{
        ret [i] = render（val [i]，i）;
      }
    } else if（typeof val ==='number'）{
      ret = new Array（val）;
      for（i = 0; i <val; i ++）{
        ret [i] = render（i + 1，i）;
      }
    } else if（isObject（val））{
      if（hasSymbol && val [Symbol.iterator]）{
        ret = [];
        var iterator = val [Symbol.iterator]（）;
        var result = iterator.next（）;
        while（！result.done）{
          ret.push（render（result.value，ret.length））;
          result = iterator.next（）;
        }
      } else {
        keys = Object.keys（val）;
        ret = new Array（keys.length）;
        for（i = 0，l = keys.length; i <l; i ++）{
          key = keys [i];
          ret [i] = render（val [key]，key，i）;
        }
      }
    }
    if（！isDef（ret））{
      ret = [];
    }
    （ret）._ isVList = true;
    返回
  }

  / * * /

  / **
   *运行时助手，用于渲染<slot>
   * /
  function renderSlot（
    名称，
    倒退，
    道具，
    bindObject
  ）{
    var scopedSlotFn = this。$ scopedSlots [name];
    var节点;
    if（scopedSlotFn）{//作用域槽
      道具=道具|| {};
      if（bindObject）{
        if（！isObject（bindObject））{
          警告（
            'slot v-bind without argument需要一个Object'，
            这个
          ）;
        }
        props = extend（extend（{}，bindObject），props）;
      }
      nodes = scopedSlotFn（props）|| 倒退;
    } else {
      nodes = this。$ slots [name] || 倒退;
    }

    var target = props && props.slot;
    if（target）{
      返回此。$ createElement（'template'，{slot：target}，nodes）
    } else {
      返回节点
    }
  }

  / * * /

  / **
   *运行时助手，用于解析过滤器
   * /
  function resolveFilter（id）{
    return resolveAsset（this。$ options，'filters'，id，true）|| 身分
  }

  / * * /

  function isKeyNotMatch（expect，actual）{
    if（Array.isArray（expect））{
      return expect.indexOf（actual）=== -1
    } else {
      返回期待！==实际
    }
  }

  / **
   *运行时助手，用于从配置中检查keyCodes。
   *暴露为Vue.prototype._k
   *将eventKeyName作为最后一个参数分别传递给后向compat
   * /
  function checkKeyCodes（
    eventKeyCode，
    键，
    builtInKeyCode，
    eventKeyName，
    builtInKeyName
  ）{
    var mappedKeyCode = config.keyCodes [key] || builtInKeyCode;
    if（builtInKeyName && eventKeyName &&！config.keyCodes [key]）{
      return isKeyNotMatch（builtInKeyName，eventKeyName）
    } else if（mappedKeyCode）{
      return isKeyNotMatch（mappedKeyCode，eventKeyCode）
    } else if（eventKeyName）{
      return hyphenate（eventKeyName）！== key
    }
  }

  / * * /

  / **
   *运行时助手，用于将v-bind =“object”合并到VNode的数据中。
   * /
  function bindObjectProps（
    数据，
    标签，
    值，
    asProp，
    isSync
  ）{
    if（value）{
      if（！isObject（value））{
        警告（
          '不带参数的v-bind需要一个Object或Array值'，
          这个
        ）;
      } else {
        if（Array.isArray（value））{
          value = toObject（value）;
        }
        var hash;
        var loop = function（key）{
          如果（
            key ==='class'||
            key ==='style'||
            isReservedAttribute（钥匙）
          ）{
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp（标签，类型，密钥）
              ？data.domProps || （data.domProps = {}）
              ：data.attrs || （data.attrs = {}）;
          }
          var camelizedKey = camelize（key）;
          var hyphenatedKey =连字符（键）;
          if（！（hashl中的camelizedKey）&&！（哈希中的hyphenatedKey））{
            hash [key] = value [key];

            if（isSync）{
              var on = data.on || （data.on = {}）;
              on [（“update：”+ key）] = function（$ event）{
                value [key] = $ event;
              };
            }
          }
        };

        for（var key in value）loop（key）;
      }
    }
    返回数据
  }

  / * * /

  / **
   *运行时助手，用于渲染静态树。
   * /
  函数renderStatic（
    指数，
    isInFor
  ）{
    var cached = this._staticTrees || （this._staticTrees = []）;
    var tree = cached [index];
    //如果已经渲染了静态树而不是v-for，
    //我们可以重用同一棵树。
    if（tree &&！isInFor）{
      返回树
    }
    //否则，渲染一棵新树。
    tree = cached [index] = this。$ options.staticRenderFns [index] .call（
      this._renderProxy，
      空值，
      这//为功能组件模板生成的渲染fns
    ）;
    markStatic（tree，（“__ static__”+ index），false）;
    返回树
  }

  / **
   * v-once的运行时助手。
   *实际上它意味着使用唯一键将节点标记为静态。
   * /
  function markOnce（
    树，
    指数，
    键
  ）{
    markStatic（tree，（“__ once__”+ index +（key？（“_”+ key）：“”）），true）;
    返回树
  }

  function markStatic（
    树，
    键，
    isOnce
  ）{
    if（Array.isArray（tree））{
      for（var i = 0; i <tree.length; i ++）{
        if（tree [i] && typeof tree [i]！=='string'）{
          markStaticNode（tree [i]，（key +“_”+ i），isOnce）;
        }
      }
    } else {
      markStaticNode（tree，key，isOnce）;
    }
  }

  function markStaticNode（node，key，isOnce）{
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  / * * /

  function bindObjectListeners（data，value）{
    if（value）{
      if（！isPlainObject（value））{
        警告（
          'v-on without argument期望一个Object值'，
          这个
        ）;
      } else {
        var on = data.on = data.on？extend（{}，data.on）：{};
        for（var key in value）{
          var existing = on [key];
          var ours = value [key];
          在[关键] =现有？[] .concat（现有的，我们的）：我们的;
        }
      }
    }
    返回数据
  }

  / * * /

  function resolveScopedSlots（
    fns，//参见flow / vnode
    水库，
    //在2.6中添加以下内容
    hasDynamicKeys，
    contentHashKey
  ）{
    res = res || {$ stable：！hasDynamicKeys};
    for（var i = 0; i <fns.length; i ++）{
      var slot = fns [i];
      if（Array.isArray（slot））{
        resolveScopedSlots（slot，res，hasDynamicKeys）;
      } else if（slot）{
        //用于反向代理v-slot的标记，没有范围。$ slots
        if（slot.proxy）{
          slot.fn.proxy = true;
        }
        res [slot.key] = slot.fn;
      }
    }
    if（contentHashKey）{
      （res）。$ key = contentHashKey;
    }
    返回资源
  }

  / * * /

  function bindDynamicKeys（baseObj，values）{
    for（var i = 0; i <values.length; i + = 2）{
      var key = values [i];
      if（typeof key ==='string'&& key）{
        baseObj [values [i]] = values [i + 1];
      } else if（key！==''&& key！== null）{
        // null是显式删除绑定的特殊值
        警告（
          （“动态指令参数的值无效（期望的字符串或null）：”+ key），
          这个
        ）;
      }
    }
    return baseObj
  }

  //帮助器动态地将修饰符运行时标记附加到事件名称。
  //确保仅在值已经是字符串时附加，否则将被强制转换
  //字符串并导致类型检查错过。
  function prependModifier（value，symbol）{
    return typeof value ==='string'？符号+价值：价值
  }

  / * * /

  function installRenderHelpers（target）{
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  / * * /

  function FunctionalRenderContext（
    数据，
    道具，
    孩子，
    父母，
    构造函数
  ）{
    var这$ 1 =这个;

    var options = Ctor.options;
    //确保功能组件中的createElement功能
    //获取唯一的上下文 - 这对于正确的命名槽检查是必要的
    var contextVm;
    if（hasOwn（parent，'_ uid'））{
      contextVm = Object.create（parent）;
      // $ flow-disable-line
      contextVm._original = parent;
    } else {
      //传入的上下文vm也是一个功能上下文。
      //在这种情况下，我们希望确保我们能够抓住
      //真正的上下文实例
      contextVm = parent;
      // $ flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue（options._compiled）;
    var needNormalization =！isCompiled;

    this.data = data;
    this.props =道具;
    this.children =孩子;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject（options.inject，parent）;
    this.slots = function（）{
      if（！this $ 1. $ slots）{
        normalizeScopedSlots（
          data.scopedSlots，
          这$ 1. $ slots = resolveSlots（孩子，父母）
        ）;
      }
      返回$ 1. $ slot
    };

    Object.defineProperty（this，'scopedSlots'，（{
      可枚举的：是的，
      get：function get（）{
        return normalizeScopedSlots（data.scopedSlots，this.slots（））
      }
    }））;

    //支持编译的功能模板
    if（isCompiled）{
      //为renderStatic（）公开$选项
      这个。$ options = options;
      //为renderSlot（）预先解析插槽
      这个。$ slots = this.slots（）;
      这个。$ scopedSlots = normalizeScopedSlots（data.scopedSlots，this。$ slots）;
    }

    if（options._scopeId）{
      this._c = function（a，b，c，d）{
        var vnode = createElement（contextVm，a，b，c，d，needNormalization）;
        if（vnode &&！Array.isArray（vnode））{
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        返回vnode
      };
    } else {
      this._c = function（a，b，c，d）{return createElement（contextVm，a，b，c，d，needNormalization）; };
    }
  }

  installRenderHelpers（FunctionalRenderContext.prototype）;

  function createFunctionalComponent（
    构造函数，
    propsData，
    数据，
    contextVm，
    孩子
  ）{
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if（isDef（propOptions））{
      for（propOptions中的var key）{
        props [key] = validateProp（key，propOptions，propsData || emptyObject）;
      }
    } else {
      if（isDef（data.attrs））{mergeProps（props，data.attrs）; }
      if（isDef（data.props））{mergeProps（props，data.props）; }
    }

    var renderContext = new FunctionalRenderContext（
      数据，
      道具，
      孩子，
      contextVm，
      构造函数
    ）;

    var vnode = options.render.call（null，renderContext._c，renderContext）;

    if（vnode instanceof VNode）{
      return cloneAndMarkFunctionalResult（vnode，data，renderContext.parent，options，renderContext）
    } else if（Array.isArray（vnode））{
      var vnodes = normalizeChildren（vnode）|| [];
      var res = new Array（vnodes.length）;
      for（var i = 0; i <vnodes.length; i ++）{
        res [i] = cloneAndMarkFunctionalResult（vnodes [i]，data，renderContext.parent，options，renderContext）;
      }
      返回资源
    }
  }

  function cloneAndMarkFunctionalResult（vnode，data，contextVm，options，renderContext）{
    //＃7817在设置fnContext之前克隆节点，否则如果重用该节点
    //（例如，它来自缓存的普通插槽）fnContext导致命名的插槽
    //不应匹配匹配。
    var clone = cloneVNode（vnode）;
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
      （clone.devtoolsMeta = clone.devtoolsMeta || {}）。renderContext = renderContext;
    }
    if（data.slot）{
      （clone.data ||（clone.data = {}））。slot = data.slot;
    }
    返回克隆
  }

  function mergeProps（to，from）{
    for（var key in from）{
      至[camelize（key）] =来自[key];
    }
  }

  / * * /

  / * * /

  / * * /

  / * * /

  //在补丁期间在组件VNode上调用内联挂钩
  var componentVNodeHooks = {
    init：function init（vnode，hydrating）{
      如果（
        vnode.componentInstance &&
        ！vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ）{
        //保持活着的组件，视为一个补丁
        var mountedNode = vnode; //解决流程问题
        componentVNodeHooks.prepatch（mountedNode，mountedNode）;
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode（
          虚拟节点，
          activeInstance
        ）;
        孩子。$ mount（保湿？vnode.elm：未定义，保湿）;
      }
    }，

    prepatch：function prepatch（oldVnode，vnode）{
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent（
        儿童，
        options.propsData，//更新道具
        options.listeners，//更新的侦听器
        vnode，//新的父vnode
        options.children //新孩子
      ）;
    }，

    insert：function insert（vnode）{
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if（！componentInstance._isMounted）{
        componentInstance._isMounted = true;
        callHook（componentInstance，'mounted'）;
      }
      if（vnode.data.keepAlive）{
        if（context._isMounted）{
          // vue-router＃1212
          //在更新期间，保持活动组件的子组件可以
          //更改，所以在这里直接走树可能会调用激活的钩子
          //对不正确的孩子。相反，我们将它们推入队列中
          //在整个补丁程序结束后进行处理。
          queueActivatedComponent（componentInstance）;
        } else {
          activateChildComponent（componentInstance，true / * direct * /）;
        }
      }
    }，

    destroy：function destroy（vnode）{
      var componentInstance = vnode.componentInstance;
      if（！componentInstance._isDestroyed）{
        if（！vnode.data.keepAlive）{
          。componentInstance $ destroy（）方法;
        } else {
          deactivateChildComponent（componentInstance，true / * direct * /）;
        }
      }
    }
  };

  var hooksToMerge = Object.keys（componentVNodeHooks）;

  function createComponent（
    构造函数，
    数据，
    背景下，
    孩子，
    标签
  ）{
    if（isUndef（Ctor））{
      返回
    }

    var baseCtor = context。$ options._base;

    //普通选项对象：将其转换为构造函数
    if（isObject（Ctor））{
      Ctor = baseCtor.extend（Ctor）;
    }

    //如果在这个阶段它不是构造函数或异步组件工厂，
    // 拒绝。
    if（typeof Ctor！=='function'）{
      {
        warn（（“无效的组件定义：”+（String（Ctor））），context）;
      }
      返回
    }

    //异步组件
    var asyncFactory;
    if（isUndef（Ctor.cid））{
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent（asyncFactory，baseCtor）;
      if（Ctor === undefined）{
        //返回异步组件的占位符节点，该节点将被呈现
        //作为注释节点，但保留节点的所有原始信息。
        //该信息将用于异步服务器渲染和水合。
        return createAsyncPlaceholder（
          asyncFactory，
          数据，
          背景下，
          孩子，
          标签
        ）
      }
    }

    data = data || {};

    //在以后应用全局混合的情况下解析构造函数选项
    //组件构造函数创建
    resolveConstructorOptions（CTOR）;

    //将组件v模型数据转换为道具和事件
    if（isDef（data.model））{
      transformModel（Ctor.options，data）;
    }

    //提取道具
    var propsData = extractPropsFromVNodeData（data，Ctor，tag）;

    //功能组件
    if（isTrue（Ctor.options.functional））{
      return createFunctionalComponent（Ctor，propsData，data，context，children）
    }

    //提取侦听器，因为这些需要被视为
    //子组件侦听器而不是DOM侦听器
    var listeners = data.on;
    //用.native修饰符替换为侦听器
    //因此在父组件补丁期间处理它。
    data.on = data.nativeOn;

    if（isTrue（Ctor.options.abstract））{
      //抽象组件不保留任何内容
      //除了道具和听众以及老虎机

      //解决流程问题
      var slot = data.slot;
      data = {};
      if（slot）{
        data.slot = slot;
      }
    }

    //将组件管理挂钩安装到占位符节点上
    installComponentHooks（数据）;

    //返回占位符vnode
    var name = Ctor.options.name || 标签;
    var vnode = new VNode（
      （“vue-component-”+（Ctor.cid）+（name？（“ - ”+ name）：''）），
      数据，未定义，未定义，未定义，上下文，
      {Ctor：Ctor，propsData：propsData，listeners：listeners，tag：tag，children：children}，
      asyncFactory
    ）;

    返回vnode
  }

  function createComponentInstanceForVnode（
    vnode，//我们知道它是MountedComponentVNode但流不是
    parent //生命周期状态中的activeInstance
  ）{
    var options = {
      _isComponent：true，
      _parentVnode：vnode，
      父母：父母
    };
    //检查内联模板渲染功能
    var inlineTemplate = vnode.data.inlineTemplate;
    if（isDef（inlineTemplate））{
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor（options）
  }

  function installComponentHooks（data）{
    var hooks = data.hook || （data.hook = {}）;
    for（var i = 0; i <hooksToMerge.length; i ++）{
      var key = hooksToMerge [i];
      var existing = hooks [key];
      var toMerge = componentVNodeHooks [key];
      if（existing！== toMerge &&！（existing && existing._merged））{
        hooks [key] =现有的？mergeHook $ 1（toMerge，existing）：toMerge;
      }
    }
  }

  function mergeHook $ 1（f1，f2）{
    var merged = function（a，b）{
      // flow抱怨额外的args，这就是我们使用any的原因
      f1（a，b）;
      f2（a，b）;
    };
    merged._merged = true;
    返回合并
  }

  //将组件v-model信息（值和回调）转换为
  //分别是prop和event handler。
  function transformModel（options，data）{
    var prop =（options.model && options.model.prop）|| '值';
    var event =（options.model && options.model.event）|| “输入”
    ;（data.attrs ||（data.attrs = {}））[prop] = data.model.value;
    var on = data.on || （data.on = {}）;
    var existing = on [event];
    var callback = data.model.callback;
    if（isDef（existing））{
      如果（
        Array.isArray（现有）
          ？existing.indexOf（callback）=== -1
          ：现有！==回调
      ）{
        on [event] = [callback] .concat（existing）;
      }
    } else {
      on [event] =回调;
    }
  }

  / * * /

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  //包装函数，用于提供更灵活的界面
  //没有被流量吼叫
  function createElement（
    背景下，
    标签，
    数据，
    孩子，
    normalizationType，
    alwaysNormalize
  ）{
    if（Array.isArray（data）|| isPrimitive（data））{
      normalizationType = children;
      儿童=数据;
      data = undefined;
    }
    if（isTrue（alwaysNormalize））{
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement（context，tag，data，children，normalizationType）
  }

  function _createElement（
    背景下，
    标签，
    数据，
    孩子，
    normalizationType
  ）{
    if（isDef（data）&& isDef（（data）.__ ob __））{
      警告（
        “避免将观察到的数据对象用作vnode数据：”+（JSON.stringify（data））+“\ n”+
        “总是在每个渲染中创建新的vnode数据对象！”，
        上下文
      ）;
      return createEmptyVNode（）
    }
    // v-bind中的对象语法
    if（isDef（data）&& isDef（data.is））{
      tag = data.is;
    }
    if（！tag）{
      //如果是component：设置为falsy值
      return createEmptyVNode（）
    }
    //警告非原始密钥
    if（isDef（data）&& isDef（data.key）&&！isPrimitive（data.key）
    ）{
      {
        警告（
          '避免使用非原始值作为键，'+
          '改用字符串/数字值。'，
          上下文
        ）;
      }
    }
    //支持单个函数children作为默认的作用域槽
    if（Array.isArray（children）&&
      typeof children [0] ==='function'
    ）{
      data = data || {};
      data.scopedSlots = {default：children [0]};
      children.length = 0;
    }
    if（normalizationType === ALWAYS_NORMALIZE）{
      children = normalizeChildren（儿童）;
    } else if（normalizationType === SIMPLE_NORMALIZE）{
      children = simpleNormalizeChildren（children）;
    }
    var vnode，ns;
    if（typeof tag ==='string'）{
      var Ctor;
      ns =（context。$ vnode && context。$ vnode.ns）|| config.getTagNamespace（标签）;
      if（config.isReservedTag（tag））{
        //平台内置元素
        vnode =新的VNode（
          config.parsePlatformTagName（tag），数据，孩子，
          undefined，undefined，context
        ）;
      } else if（（！data ||！data.pre）&& isDef（Ctor = resolveAsset（context。$ options，'components'，tag）））{
        // 零件
        vnode = createComponent（Ctor，data，context，children，tag）;
      } else {
        //未知或未列出的命名空间元素
        //在运行时检查，因为它可能会被赋予命名空间
        //父母规范孩子
        vnode =新的VNode（
          标签，数据，儿童，
          undefined，undefined，context
        ）;
      }
    } else {
      //直接组件选项/构造函数
      vnode = createComponent（tag，data，context，children）;
    }
    if（Array.isArray（vnode））{
      返回vnode
    } else if（isDef（vnode））{
      if（isDef（ns））{applyNS（vnode，ns）; }
      if（isDef（data））{registerDeepBindings（data）; }
      返回vnode
    } else {
      return createEmptyVNode（）
    }
  }

  function applyNS（vnode，ns，force）{
    vnode.ns = ns;
    if（vnode.tag ==='foreignObject'）{
      //在foreignObject中使用默认命名空间
      ns =未定义;
      force = true;
    }
    if（isDef（vnode.children））{
      for（var i = 0，l = vnode.children.length; i <l; i ++）{
        var child = vnode.children [i];
        if（isDef（child.tag）&&（
          isUndef（child.ns）|| （isTrue（force）&& child.tag！=='svg'）））{
          applyNS（child，ns，force）;
        }
      }
    }
  }

  //参考＃5318
  //必须确保父类在深度绑定时重新渲染，如：style和
  //：class用于插槽节点
  function registerDeepBindings（data）{
    if（isObject（data.style））{
      遍历（data.style）;
    }
    if（isObject（data.class））{
      遍历（data.class）;
    }
  }

  / * * /

  function initRender（vm）{
    vm._vnode = null; //子树的根
    vm._staticTrees = null; // v-once缓存树
    var options = vm。$ options;
    var parentVnode = vm。$ vnode = options._parentVnode; //父树中的占位符节点
    var renderContext = parentVnode && parentVnode.context;
    vm。$ slots = resolveSlots（options._renderChildren，renderContext）;
    vm。$ scopedSlots = emptyObject;
    //将createElement fn绑定到此实例
    //以便我们在其中获得适当的渲染上下文。
    // args order：tag，data，children，normalizationType，alwaysNormalize
    //内部版本由从模板编译的渲染函数使用
    vm._c = function（a，b，c，d）{return createElement（vm，a，b，c，d，false）; };
    //常规应用于公共版本，用于
    //用户编写的渲染函数。
    vm。$ createElement = function（a，b，c，d）{return createElement（vm，a，b，c，d，true）; };

    //暴露了$ attrs和$ listeners以便更容易创建HOC。
    //他们需要被动反应，以便使用它们的HOC始终更新
    var parentData = parentVnode && parentVnode.data;

    / * istanbul忽略其他* /
    {
      defineReactive $$ 1（vm，'$ attrs'，parentData && parentData.attrs || emptyObject，function（）{
        ！isUpdatingChildComponent && warn（“$ attrs是readonly。”，vm）;
      ，真实）;
      defineReactive $$ 1（vm，'$ listeners'，options._parentListeners || emptyObject，function（）{
        ！isUpdatingChildComponent && warn（“$ listeners is readonly。”，vm）;
      ，真实）;
    }
  }

  var currentRenderingInstance = null;

  function renderMixin（Vue）{
    //安装运行时便利助手
    installRenderHelpers（Vue.prototype）;

    Vue.prototype。$ nextTick = function（fn）{
      return nextTick（fn，this）
    };

    Vue.prototype._render = function（）{
      var vm = this;
      var ref = vm。$ options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if（_parentVnode）{
        vm。$ scopedSlots = normalizeScopedSlots（
          _parentVnode.data.scopedSlots，
          VM。$插槽，
          VM。$ scopedSlots
        ）;
      }

      //设置父vnode。这允许渲染函数具有访问权限
      //占位符节点上的数据。
      vm。$ vnode = _parentVnode;
      //渲染自我
      var vnode;
      尝试{
        //因为所有渲染fns都被调用，所以不需要维护堆栈
        //彼此分开。调用嵌套组件的渲染fns
        //修补父组件时
        currentRenderingInstance = vm;
        vnode = render.call（vm._renderProxy，vm。$ createElement）;
      } catch（e）{
        handleError（e，vm，“render”）;
        //返回错误渲染结果，
        //或以前的vnode，以防止渲染错误导致空白组件
        / * istanbul忽略其他* /
        if（vm。$ options.renderError）{
          尝试{
            vnode = vm。$ options.renderError.call（vm._renderProxy，vm。$ createElement，e）;
          } catch（e）{
            handleError（e，vm，“renderError”）;
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      //如果返回的数组只包含一个节点，则允许它
      if（Array.isArray（vnode）&& vnode.length === 1）{
        vnode = vnode [0];
      }
      //如果渲染函数出错，则返回空的vnode
      if（！（vnode instanceof VNode））{
        if（Array.isArray（vnode））{
          警告（
            '从渲染函数返回多个根节点。渲染函数'+
            '应该返回一个根节点。'，
            VM
          ）;
        }
        vnode = createEmptyVNode（）;
      }
      //设置父级
      vnode.parent = _parentVnode;
      返回vnode
    };
  }

  / * * /

  function ensureCtor（comp，base）{
    如果（
      comp .__ esModule ||
      （hasSymbol && comp [Symbol.toStringTag] ==='模块'）
    ）{
      comp = comp.default;
    }
    return isObject（comp）
      ？base.extend（COMP）
      ：comp
  }

  function createAsyncPlaceholder（
    厂，
    数据，
    背景下，
    孩子，
    标签
  ）{
    var node = createEmptyVNode（）;
    node.asyncFactory = factory;
    node.asyncMeta = {data：data，context：context，children：children，tag：tag};
    返回节点
  }

  function resolveAsyncComponent（
    厂，
    baseCtor
  ）{
    if（isTrue（factory.error）&& isDef（factory.errorComp））{
      return factory.errorComp
    }

    if（isDef（factory.resolved））{
      返回factory.resolved
    }

    var owner = currentRenderingInstance;
    if（owner && isDef（factory.owners）&& factory.owners.indexOf（owner）=== -1）{
      //已经挂起
      factory.owners.push（所有者）;
    }

    if（isTrue（factory.loading）&& isDef（factory.loadingComp））{
      return factory.loadingComp
    }

    if（owner &&！isDef（factory.owners））{
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;（所有者）。$ on（'hook：destroyed'，function（）{return remove（所有者，所有者）;}）;

      var forceRender = function（renderCompleted）{
        for（var i = 0，l = owners.length; i <l; i ++）{
          （所有者[I]）$ forceUpdate（）;
        }

        if（renderCompleted）{
          owners.length = 0;
          if（timerLoading！== null）{
            clearTimeout（timerLoading）;
            timerLoading = null;
          }
          if（timerTimeout！== null）{
            clearTimeout（timerTimeout）;
            timerTimeout = null;
          }
        }
      };

      var resolve = once（function（res）{
        //缓存已解决
        factory.resolved = ensureCtor（res，baseCtor）;
        //仅当这不是同步解析时才调用回调
        //（在SSR期间，异步解析会以同步方式匀化）
        if（！sync）{
          forceRender（真）;
        } else {
          owners.length = 0;
        }
      }）;

      var reject = once（function（reason）{
        警告（
          “无法解析异步组件：”+（String（factory））+
          （原因？（“\ n Reason：”+原因）：''）
        ）;
        if（isDef（factory.errorComp））{
          factory.error = true;
          forceRender（真）;
        }
      }）;

      var res = factory（解决，拒绝）;

      if（isObject（res））{
        if（isPromise（res））{
          //（）=>承诺
          if（isUndef（factory.resolved））{
            res.then（解决，拒绝）;
          }
        } else if（isPromise（res.component））{
          res.component.then（resolve，reject）;

          if（isDef（res.error））{
            factory.errorComp = ensureCtor（res.error，baseCtor）;
          }

          if（isDef（res.loading））{
            factory.loadingComp = ensureCtor（res.loading，baseCtor）;
            if（res.delay === 0）{
              factory.loading = true;
            } else {
              timerLoading = setTimeout（function（）{
                timerLoading = null;
                if（isUndef（factory.resolved）&& isUndef（factory.error））{
                  factory.loading = true;
                  forceRender（假）;
                }
              }，res.delay || 200）;
            }
          }

          if（isDef（res.timeout））{
            timerTimeout = setTimeout（function（）{
              timerTimeout = null;
              if（isUndef（factory.resolved））{
                拒绝（
                  “超时（”+（res.timeout）+“ms）”
                ）;
              }
            }，res.timeout）;
          }
        }
      }

      sync = false;
      //返回以防同步解析
      返回factory.loading
        ？factory.loadingComp
        ：factory.resolved
    }
  }

  / * * /

  function isAsyncPlaceholder（node）{
    return node.isComment && node.asyncFactory
  }

  / * * /

  function getFirstComponentChild（children）{
    if（Array.isArray（children））{
      for（var i = 0; i <children.length; i ++）{
        var c = children [i];
        if（isDef（c）&&（isDef（c.componentOptions）|| isAsyncPlaceholder（c）））{
          返回c
        }
      }
    }
  }

  / * * /

  / * * /

  function initEvents（vm）{
    vm._events = Object.create（null）;
    vm._hasHookEvent = false;
    // init父附加事件
    var listeners = vm。$ options._parentListeners;
    if（听众）{
      updateComponentListeners（vm，listeners）;
    }
  }

  var target;

  function add（event，fn）{
    target。$ on（event，fn）;
  }

  function remove $ 1（event，fn）{
    目标。$ off（event，fn）;
  }

  function createOnceHandler（event，fn）{
    var _target = target;
    return函数onceHandler（）{
      var res = fn.apply（null，arguments）;
      if（res！== null）{
        _target。$ off（event，onceHandler）;
      }
    }
  }

  function updateComponentListeners（
    VM，
    听众，
    oldListeners
  ）{
    target = vm;
    updateListeners（listeners，oldListeners || {}，add，remove $ 1，createOnceHandler，vm）;
    target = undefined;
  }

  function eventsMixin（Vue）{
    var hookRE = / ^ hook：/;
    Vue.prototype。$ on = function（event，fn）{
      var vm = this;
      if（Array.isArray（event））{
        for（var i = 0，l = event.length; i <l; i ++）{
          vm。$ on（event [i]，fn）;
        }
      } else {
        （vm._events [event] ||（vm._events [event] = []））。push（fn）;
        //使用注册时标记的布尔标志优化钩子：事件成本
        //而不是哈希查找
        if（hookRE.test（event））{
          vm._hasHookEvent = true;
        }
      }
      返回vm
    };

    Vue.prototype。$ once = function（event，fn）{
      var vm = this;
      function on（）{
        vm。$ off（event，on）;
        fn.apply（vm，arguments）;
      }
      on.fn = fn;
      vm。$ on（event，on）;
      返回vm
    };

    Vue.prototype。$ off = function（event，fn）{
      var vm = this;
      //所有
      if（！arguments.length）{
        vm._events = Object.create（null）;
        返回vm
      }
      //事件数组
      if（Array.isArray（event））{
        for（var i $ 1 = 0，l = event.length; i $ 1 <l; i $ 1 ++）{
          vm。$ off（event [i $ 1]，fn）;
        }
        返回vm
      }
      //特定事件
      var cbs = vm._events [event];
      if（！cbs）{
        返回vm
      }
      if（！fn）{
        vm._events [event] = null;
        返回vm
      }
      //特定的处理程序
      var cb;
      var i = cbs.length;
      当我 - ） {
        cb = cbs [i];
        if（cb === fn || cb.fn === fn）{
          cbs.splice（i，1）;
          打破
        }
      }
      返回vm
    };

    Vue.prototype。$ emit = function（event）{
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase（）;
        if（lowerCaseEvent！== event && vm._events [lowerCaseEvent]）{
          小费（
            “Event \”“+ lowerCaseEvent +”\“在组件”+中发出
            （formatComponentName（vm））+“但处理程序已注册为\”“+ event +”\“。”+
            “请注意，HTML属性不区分大小写，您不能使用”+
            “使用in-DOM模板时，使用v-on来监听camelCase事件。”+
            “你应该使用\”“+（连字符（事件））+”\“而不是\”“+ event +”\“。”
          ）;
        }
      }
      var cbs = vm._events [event];
      if（cbs）{
        cbs = cbs.length> 1？toArray（cbs）：cbs;
        var args = toArray（arguments，1）;
        var info =“事件处理程序为\”“+ event +”\“”;
        for（var i = 0，l = cbs.length; i <l; i ++）{
          invokeWithErrorHandling（cbs [i]，vm，args，vm，info）;
        }
      }
      返回vm
    };
  }

  / * * /

  var activeInstance = null;
  var isUpdatingChildComponent = false;

  function setActiveInstance（vm）{
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function（）{
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle（vm）{
    var options = vm。$ options;

    //找到第一个非抽象父级
    var parent = options.parent;
    if（parent &&！options.abstract）{
      while（parent。$ options.abstract && parent。$ parent）{
        parent = parent。$ parent;
      }
      。父$ children.push（VM）;
    }

    vm。$ parent = parent;
    vm。$ root = parent？parent。$ root：vm;

    vm。$ children = [];
    vm。$ refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin（Vue）{
    Vue.prototype._update = function（vnode，hydrating）{
      var vm = this;
      var prevEl = vm。$ el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance（vm）;
      vm._vnode = vnode;
      // Vue.prototype .__ patch__在入口点注入
      //基于使用的渲染后端。
      if（！prevVnode）{
        //初始渲染
        vm。$ el = vm .__ patch __（vm。$ el，vnode，hydrating，false / * removeOnly * /）;
      } else {
        // 更新
        vm。$ el = vm .__ patch __（prevVnode，vnode）;
      }
      restoreActiveInstance（）;
      //更新__vue__参考
      if（prevEl）{
        prevEl .__ vue__ = null;
      }
      if（vm。$ el）{
        vm。$ el .__ vue__ = vm;
      }
      //如果父亲是HOC，也要更新其$ el
      if（vm。$ vnode && vm。$ parent && vm。$ vnode === vm。$ parent._vnode）{
        vm。$ parent。$ el = vm。$ el;
      }
      //调度程序调用更新的挂钩以确保子节点
      //在父级更新的钩子中更新。
    };

    Vue.prototype。$ forceUpdate = function（）{
      var vm = this;
      if（vm._watcher）{
        vm._watcher.update（）;
      }
    };

    Vue.prototype。$ destroy = function（）{
      var vm = this;
      if（vm._isBeingDestroyed）{
        返回
      }
      callHook（vm，'beforeDestroy'）;
      vm._isBeingDestroyed = true;
      //从父母中删除自己
      var parent = vm。$ parent;
      if（parent &&！parent._isBeingDestroyed &&！vm。$ options.abstract）{
        remove（parent。$ children，vm）;
      }
      //拆解观察者
      if（vm._watcher）{
        vm._watcher.teardown（）;
      }
      var i = vm._watchers.length;
      当我 - ） {
        vm._watchers [I] .teardown（）;
      }
      //从数据ob中删除引用
      //冻结的对象可能没有观察者。
      if（vm._data .__ ob __）{
        vm._data .__ OB __ vmCount--。
      }
      //调用最后一个钩子......
      vm._isDestroyed = true;
      //在当前渲染的树上调用destroy hooks
      vm .__ patch __（vm._vnode，null）;
      //火毁了钩子
      callHook（vm，'destroyed'）;
      //关闭所有实例监听器。
      VM $关闭（）。
      //删除__vue__引用
      if（vm。$ el）{
        vm。$ el .__ vue__ = null;
      }
      //发布循环引用（＃6759）
      if（vm。$ vnode）{
        vm。$ vnode.parent = null;
      }
    };
  }

  function mountComponent（
    VM，
    埃尔，
    保湿
  ）{
    vm。$ el = el;
    if（！vm。$ options.render）{
      vm。$ options.render = createEmptyVNode;
      {
        / *伊斯坦布尔忽略如果* /
        if（（vm。$ options.template && vm。$ options.template.charAt（0）！=='＃'）||
          vm。$ options.el || el）{
          警告（
            '您正在使用Vue的仅运行时版本，其中模板为'+
            '编译器不可用。将模板预编译为'+
            '渲染函数，或使用包含编译器的构建。'，
            VM
          ）;
        } else {
          警告（
            '无法安装组件：模板或渲染函数未定义。'，
            VM
          ）;
        }
      }
    }
    callHook（vm，'beforeMount'）;

    var updateComponent;
    / *伊斯坦布尔忽略如果* /
    if（config.performance && mark）{
      updateComponent = function（）{
        var name = vm._name;
        var id = vm._uid;
        var startTag =“vue-perf-start：”+ id;
        var endTag =“vue-perf-end：”+ id;

        标记（STARTTAG）;
        var vnode = vm._render（）;
        标记（ENDTAG）;
        measure（（“vue”+ name +“render”），startTag，endTag）;

        标记（STARTTAG）;
        vm._update（vnode，保湿）;
        标记（ENDTAG）;
        measure（（“vue”+ name +“patch”），startTag，endTag）;
      };
    } else {
      updateComponent = function（）{
        vm._update（vm._render（），保湿）;
      };
    }

    //我们在观察者的构造函数中将其设置为vm._watcher
    //因为观察者的初始补丁可能会调用$ forceUpdate（例如内部的孩子
    // component的挂钩），它依赖于已定义的vm._watcher
    新的Watcher（vm，updateComponent，noop，{
      before：function before（）{
        if（vm._isMounted &&！vm._isDestroyed）{
          callHook（vm，'beforeUpdate'）;
        }
      }
    }，true / * isRenderWatcher * /）;
    保湿=假;

    //手动挂载实例，调用挂载在self上
    //在其插入的钩子中为渲染创建的子组件调用
    if（vm。$ vnode == null）{
      vm._isMounted = true;
      callHook（vm，'mounted'）;
    }
    返回vm
  }

  function updateChildComponent（
    VM，
    propsData，
    听众，
    parentVnode，
    renderChildren
  ）{
    {
      isUpdatingChildComponent = true;
    }

    //确定组件是否有插槽子节点
    //我们需要在覆盖$ options._renderChildren之前执行此操作。

    //检查是否有动态scopedSlots（手写或编译但有
    //动态插槽名称）。从模板编译的静态作用域槽具有
    //“$ stable”标记。
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm。$ scopedSlots;
    var hasDynamicScopedSlot = !!（
      （newScopedSlots &&！newScopedSlots。$ stable）||
      （oldScopedSlots！== emptyObject &&！oldScopedSlots。$ stable）||
      （newScopedSlots && vm。$ scopedSlots。$ key！== newScopedSlots。$ key）
    ）;

    //来自父级的任何静态插槽子级可能在父级中发生了更改
    //更新 动态范围的插槽也可能已更改。在这种情况下，强迫
    //更新是必要的，以确保正确性。
    var needsForceUpdate = !!（
      renderChildren || //有新的静态插槽
      vm。$ options._renderChildren || //有旧的静态插槽
      hasDynamicScopedSlot
    ）;

    vm。$ options._parentVnode = parentVnode;
    vm。$ vnode = parentVnode; //更新vm的占位符节点而不重新渲染

    if（vm._vnode）{//更新子树的父级
      vm._vnode.parent = parentVnode;
    }
    vm。$ options._renderChildren = renderChildren;

    //更新$ attrs和$ listeners哈希
    //这些也是反应性的，所以如果孩子，他们可能会触发子更新
    //在渲染过程中使用它们
    vm。$ attrs = parentVnode.data.attrs || emptyObject;
    vm。$ listeners = listeners || emptyObject;

    //更新道具
    if（propsData && vm。$ options.props）{
      toggleObserving（假）;
      var props = vm._props;
      var propKeys = vm。$ options._propKeys || [];
      for（var i = 0; i <propKeys.length; i ++）{
        var key = propKeys [i];
        var propOptions = vm。$ options.props; // wtf流量？
        props [key] = validateProp（key，propOptions，propsData，vm）;
      }
      toggleObserving（真）;
      //保留原始propsData的副本
      vm。$ options.propsData = propsData;
    }

    //更新监听器
    listeners = listeners || emptyObject;
    var oldListeners = vm。$ options._parentListeners;
    vm。$ options._parentListeners = listeners;
    updateComponentListeners（vm，listeners，oldListeners）;

    //如果有孩子，请解决插槽+强制更新
    if（needsForceUpdate）{
      vm。$ slots = resolveSlots（renderChildren，parentVnode.context）;
      VM $ forceUpdate（）。
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree（vm）{
    while（vm &&（vm = vm。$ parent））{
      if（vm._inactive）{return true}
    }
    返回false
  }

  function activateChildComponent（vm，direct）{
    if（direct）{
      vm._directInactive = false;
      if（isInInactiveTree（vm））{
        返回
      }
    } else if（vm._directInactive）{
      返回
    }
    if（vm._inactive || vm._inactive === null）{
      vm._inactive = false;
      for（var i = 0; i <vm。$ children.length; i ++）{
        activateChildComponent（VM $儿[i]）;
      }
      callHook（vm，'activated'）;
    }
  }

  function deactivateChildComponent（vm，direct）{
    if（direct）{
      vm._directInactive = true;
      if（isInInactiveTree（vm））{
        返回
      }
    }
    if（！vm._inactive）{
      vm._inactive = true;
      for（var i = 0; i <vm。$ children.length; i ++）{
        deactivateChildComponent（VM $儿[i]）;
      }
      callHook（vm，'deactivated'）;
    }
  }

  function callHook（vm，hook）{
    //＃7573在调用生命周期钩子时禁用dep集合
    pushTarget（）;
    var handlers = vm。$ options [hook];
    var info = hook +“hook”;
    if（handlers）{
      for（var i = 0，j = handlers.length; i <j; i ++）{
        invokeWithErrorHandling（handlers [i]，vm，null，vm，info）;
      }
    }
    if（vm._hasHookEvent）{
      vm。$ emit（'hook：'+ hook）;
    }
    popTarget（）;
  }

  / * * /

  var MAX_UPDATE_COUNT = 100;

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  / **
   *重置调度程序的状态。
   * /
  function resetSchedulerState（）{
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  //异步边缘情况＃6566需要在事件侦听器时保存时间戳
  //附上 但是，调用performance.now（）会产生性能上升
  //如果页面有数千个事件侦听器。相反，我们采用时间戳
  //每次调度程序刷新并将其用于所有事件侦听器
  //在同花顺期间附上
  var currentFlushTimestamp = 0;

  //异步边缘大小写修复需要存储事件侦听器的附加时间戳。
  var getNow = Date.now;

  //确定浏览器正在使用的事件时间戳。烦人的，
  //时间戳可以是高分辨率（相对于页面加载）或低分辨率
  //（相对于UNIX纪元），所以为了比较我们必须使用的时间
  //保存刷新时间戳时的相同时间戳类型。
  //所有IE版本都使用低分辨率事件时间戳，并且时钟有问题
  //实现（＃9632）
  if（inBrowser &&！isIE）{
    var performance = window.performance;
    如果（
      表现&&
      typeof performance.now ==='function'&&
      getNow（）> document.createEvent（'Event'）。timeStamp
    ）{
      //如果事件时间戳，虽然在Date.now（）之后进行了评估，但是
      //比它小，这意味着事件正在使用高分辨率时间戳，
      //我们需要将高分辨率版本用于事件监听器时间戳
      // 好。
      getNow = function（）{return performance.now（）; };
    }
  }

  / **
   *冲洗两个队列并运行观察者。
   * /
  function flushSchedulerQueue（）{
    currentFlushTimestamp = getNow（）;
    flushing = true;
    var watcher，id;

    //在刷新之前排队队列。
    //这可以确保：
    // 1.组件从父级更新为子级。（因为父母总是
    //在孩子面前创建）
    // 2.组件的用户观察者在其渲染观察者之前运行（因为
    //在渲染观察者之前创建用户观察者）
    // 3.如果在父组件的观察程序运行期间销毁了组件，
    //可以跳过其观察者。
    queue.sort（function（a，b）{return a.id  -  b.id;}）;

    //不要缓存长度，因为可能会推送更多的观察者
    //当我们运行现有的观察者时
    for（index = 0; index <queue.length; index ++）{
      watcher = queue [index];
      if（watcher.before）{
        watcher.before（）;
      }
      id = watcher.id;
      有[id] = null;
      watcher.run（）;
      //在开发构建中，检查并停止循环更新。
      if（has [id]！= null）{
        circular [id] =（circular [id] || 0）+ 1;
        if（circular [id]> MAX_UPDATE_COUNT）{
          警告（
            '你可能有一个无限的更新循环'+（
              watcher.user
                ？（“在观察者中使用表达式”“+（watcher.expression）+”\“”）
                ：“在组件渲染功能中。”
            ）
            watcher.vm
          ）;
          打破
        }
      }
    }

    //在重置状态之前保留帖子队列的副本
    var activatedQueue = activatedChildren.slice（）;
    var updatedQueue = queue.slice（）;

    resetSchedulerState（）;

    //调用组件更新并激活挂钩
    callActivatedHooks（activatedQueue）;
    callUpdatedHooks（updatedQueue）;

    // devtool hook
    / *伊斯坦布尔忽略如果* /
    if（devtools && config.devtools）{
      devtools.emit（ '齐平'）;
    }
  }

  function callUpdatedHooks（queue）{
    var i = queue.length;
    当我 - ） {
      var watcher = queue [i];
      var vm = watcher.vm;
      if（vm._watcher === watcher && vm._isMounted &&！vm._isDestroyed）{
        callHook（vm，'updated'）;
      }
    }
  }

  / **
   *排队在补丁期间激活的保持活动的组件。
   *修补整个树后将处理队列。
   * /
  function queueActivatedComponent（vm）{
    //在这里将_inactive设置为false，以便渲染功能可以
    //依赖于检查它是否在非活动树中（例如路由器视图）
    vm._inactive = false;
    activatedChildren.push（VM）;
  }

  function callActivatedHooks（queue）{
    for（var i = 0; i <queue.length; i ++）{
      queue [i] ._ inactive = true;
      activateChildComponent（queue [i]，true / * true * /）;
    }
  }

  / **
   *将观察者推入观察者队列。
   *除非是，否则将跳过具有重复ID的作业
   *刷新队列时按下。
   * /
  function queueWatcher（watcher）{
    var id = watcher.id;
    if（has [id] == null）{
      有[id] =真;
      if（！flushing）{
        queue.push（观察者）;
      } else {
        //如果已经刷新，请根据其ID来拼接观察者
        //如果已经超过了它的id，它将立即运行。
        var i = queue.length  -  1;
        while（i> index && queue [i] .id> watcher.id）{
          一世 - ;
        }
        queue.splice（i + 1,0，观察者）;
      }
      //排队同花顺
      if（！waiting）{
        waiting = true;

        if（！config.async）{
          flushSchedulerQueue（）;
          返回
        }
        nextTick（flushSchedulerQueue）;
      }
    }
  }

  / * * /



  var uid $ 2 = 0;

  / **
   *观察者解析表达式，收集依赖关系，
   *并在表达式值更改时触发回调。
   *这用于$ watch（）api和指令。
   * /
  var Watcher =功能观察者（
    VM，
    expOrFn，
    CB，
    选项，
    isRenderWatcher
  ）{
    this.vm = vm;
    if（isRenderWatcher）{
      vm._watcher = this;
    }
    vm._watchers.push（本）;
    //选项
    if（options）{
      this.deep = !! options.deep;
      this.user = !! options.user;
      this.lazy = !! options.lazy;
      this.sync = !! options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++ uid $ 2; //用于批处理的uid
    this.active = true;
    this.dirty = this.lazy; //对于懒惰的观察者
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set（）;
    this.newDepIds = new _Set（）;
    this.expression = expOrFn.toString（）;
    //解析getter的表达式
    if（typeof expOrFn ==='function'）{
      this.getter = expOrFn;
    } else {
      this.getter = parsePath（expOrFn）;
      if（！this.getter）{
        this.getter = noop;
        警告（
          “观看路径失败：\”“+ expOrFn +”\“”+
          'Watcher只接受简单的点分隔路径。'+
          '为了完全控制，请使用功能。'，
          VM
        ）;
      }
    }
    this.value = this.lazy
      ？未定义
      ：this.get（）;
  };

  / **
   *评估getter，并重新收集依赖项。
   * /
  Watcher.prototype.get = function get（）{
    pushTarget（本）;
    var值;
    var vm = this.vm;
    尝试{
      value = this.getter.call（vm，vm）;
    } catch（e）{
      if（this.user）{
        handleError（e，vm，（“getter for watcher”“+（this.expression）+”\“”））;
      } else {
        抛出e
      }
    } finally {
      //“触摸”每个属性，以便将它们全部跟踪为
      //深度观看的依赖关系
      if（this.deep）{
        遍历（值）;
      }
      popTarget（）;
      this.cleanupDeps（）;
    }
    回报价值
  };

  / **
   *为此指令添加依赖项。
   * /
  Watcher.prototype.addDep = function addDep（dep）{
    var id = dep.id;
    if（！this.newDepIds.has（id））{
      this.newDepIds.add（ID）;
      this.newDeps.push（DEP）;
      if（！this.depIds.has（id））{
        dep.addSub（本）;
      }
    }
  };

  / **
   *清理依赖项收集。
   * /
  Watcher.prototype.cleanupDeps = function cleanupDeps（）{
    var i = this.deps.length;
    当我 - ） {
      var dep = this.deps [i];
      if（！this.newDepIds.has（dep.id））{
        dep.removeSub（本）;
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear（）;
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  / **
   *订户界面。
   *将在依赖项更改时调用。
   * /
  Watcher.prototype.update = function update（）{
    / * istanbul忽略其他* /
    if（this.lazy）{
      this.dirty = true;
    } else if（this.sync）{
      this.run（）;
    } else {
      queueWatcher（本）;
    }
  };

  / **
   *调度程序作业界面。
   *将由调度程序调用。
   * /
  Watcher.prototype.run = function run（）{
    if（this.active）{
      var value = this.get（）;
      如果（
        值！== this.value ||
        //对象/阵列上的深度观察者和观察者应该甚至开火
        //当值相同时，因为值可能
        //变异了
        isObject（value）||
        this.deep
      ）{
        //设置新值
        var oldValue = this.value;
        this.value = value;
        if（this.user）{
          尝试{
            this.cb.call（this.vm，value，oldValue）;
          } catch（e）{
            handleError（e，this.vm，（“callcher for watcher”“+（this.expression）+”\“”））;
          }
        } else {
          this.cb.call（this.vm，value，oldValue）;
        }
      }
    }
  };

  / **
   *评估观察者的价值。
   *这只适用于懒惰的观察者。
   * /
  Watcher.prototype.evaluate = function evaluate（）{
    this.value = this.get（）;
    this.dirty = false;
  };

  / **
   *取决于该观察者收集的所有代表。
   * /
  Watcher.prototype.depend = function depend（）{
    var i = this.deps.length;
    当我 - ） {
      this.deps [I]的.depend（）;
    }
  };

  / **
   *从所有依赖项的订户列表中删除self。
   * /
  Watcher.prototype.teardown = function teardown（）{
    if（this.active）{
      //从vm的观察者列表中删除self
      //这是一个有点昂贵的操作，所以我们跳过它
      //如果vm被破坏了
      if（！this.vm._isBeingDestroyed）{
        删除（this.vm._watchers，this）;
      }
      var i = this.deps.length;
      当我 - ） {
        this.deps [I] .removeSub（本）;
      }
      this.active = false;
    }
  };

  / * * /

  var sharedPropertyDefinition = {
    可枚举的：是的，
    可配置：true，
    得到：noop，
    集：noop
  };

  function proxy（target，sourceKey，key）{
    sharedPropertyDefinition.get = function proxyGetter（）{
      返回此[sourceKey] [key]
    };
    sharedPropertyDefinition.set = function proxySetter（val）{
      这[sourceKey] [key] = val;
    };
    Object.defineProperty（target，key，sharedPropertyDefinition）;
  }

  function initState（vm）{
    vm._watchers = [];
    var opts = vm。$ options;
    if（opts.props）{initProps（vm，opts.props）; }
    if（opts.methods）{initMethods（vm，opts.methods）; }
    if（opts.data）{
      initData（VM）;
    } else {
      observe（vm._data = {}，true / * asRootData * /）;
    }
    if（opts.computed）{initComputed（vm，opts.computed）; }
    if（opts.watch && opts.watch！== nativeWatch）{
      initWatch（vm，opts.watch）;
    }
  }

  function initProps（vm，propsOptions）{
    var propsData = vm。$ options.propsData || {};
    var props = vm._props = {};
    //缓存prop键，以便将来的道具更新可以使用Array进行迭代
    //而不是动态对象键枚举。
    var keys = vm。$ options._propKeys = [];
    var isRoot =！vm。$ parent;
    //应该转换根实例道具
    if（！isRoot）{
      toggleObserving（假）;
    }
    var loop = function（key）{
      keys.push（键）;
      var value = validateProp（key，propsOptions，propsData，vm）;
      / * istanbul忽略其他* /
      {
        var hyphenatedKey =连字符（键）;
        if（isReservedAttribute（hyphenatedKey）||）
            config.isReservedAttr（hyphenatedKey））{
          警告（
            （“\”“+ hyphenatedKey +”\“是一个保留属性，不能用作组件道具。”），
            VM
          ）;
        }
        defineReactive $$ 1（props，key，value，function（）{
          if（！isRoot &&！isUpdatingChildComponent）{
            警告（
              “避免直接改变道具，因为价值将是”+
              “只要父组件重新渲染，就会覆盖。”+
              “相反，使用基于道具”+的数据或计算属性
              “价值。支持变异：\”“+键+”\“”，
              VM
            ）;
          }
        }）;
      }
      //静态道具已经代理了组件的原型
      //在Vue.extend（）期间。我们只需要代理定义的道具
      //在这里实例化
      if（！（key in vm））{
        proxy（vm，“_ props”，key）;
      }
    };

    for（在propsOptions中使用var键）loop（key）;
    toggleObserving（真）;
  }

  function initData（vm）{
    var data = vm。$ options.data;
    data = vm._data = typeof data ==='function'
      ？getData（data，vm）
      ：数据|| {};
    if（！isPlainObject（data））{
      data = {};
      警告（
        '数据函数应该返回一个对象：\ n'+
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function'，
        VM
      ）;
    }
    //实例上的代理数据
    var keys = Object.keys（data）;
    var props = vm。$ options.props;
    var methods = vm。$ options.methods;
    var i = keys.length;
    当我 - ） {
      var key = keys [i];
      {
        if（methods && hasOwn（methods，key））{
          警告（
            （“Method \”“+ key +”\“已被定义为数据属性。”），
            VM
          ）;
        }
      }
      if（props && hasOwn（props，key））{
        警告（
          “数据属性\”“+键+”\“已经被声明为道具。”+
          “改用prop prop默认值。”，
          VM
        ）;
      } else if（！isReserved（key））{
        proxy（vm，“_ data”，key）;
      }
    }
    //观察数据
    observe（data，true / * asRootData * /）;
  }

  function getData（data，vm）{
    //＃7573在调用数据getter时禁用dep集合
    pushTarget（）;
    尝试{
      return data.call（vm，vm）
    } catch（e）{
      handleError（e，vm，“data（）”）;
      返回{}
    } finally {
      popTarget（）;
    }
  }

  var computedWatcherOptions = {lazy：true};

  function initComputed（vm，computed）{
    // $ flow-disable-line
    var watchers = vm._computedWatchers = Object.create（null）;
    //计算属性只是SSR期间的getter
    var isSSR = isServerRendering（）;

    for（var key in computed）{
      var userDef = computed [key];
      var getter = typeof userDef ==='function'？userDef：userDef.get;
      if（getter == null）{
        警告（
          （“计算属性中缺少Getter \”“+ key +”\“。”），
          VM
        ）;
      }

      if（！isSSR）{
        //为计算属性创建内部观察程序。
        观察者[关键] =新观察者（
          VM，
          getter || 空操作，
          空操作，
          computedWatcherOptions
        ）;
      }

      //已经定义了组件定义的计算属性
      //组件原型 我们只需要定义定义的计算属性
      //在这里实例化
      if（！（key in vm））{
        defineComputed（vm，key，userDef）;
      } else {
        if（键入vm。$ data）{
          warn（（“计算属性”“+ +键+”\“已在数据中定义。”），vm）;
        } else if（vm。$ options.props && key in vm。$ options.props）{
          warn（（“计算属性\”“+键+”\“已经定义为道具。”），vm）;
        }
      }
    }
  }

  function defineComputed（
    目标，
    键，
    USERDEF
  ）{
    var shouldCache =！isServerRendering（）;
    if（typeof userDef ==='function'）{
      sharedPropertyDefinition.get = shouldCache
        ？createComputedGetter（钥匙）
        ：createGetterInvoker（userDef）;
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ？shouldCache && userDef.cache！== false
          ？createComputedGetter（钥匙）
          ：createGetterInvoker（userDef.get）
        ：noop;
      sharedPropertyDefinition.set = userDef.set || 空操作;
    }
    if（sharedPropertyDefinition.set === noop）{
      sharedPropertyDefinition.set = function（）{
        警告（
          （“Computed property \”“+ key +”\“已分配给但它没有setter。”），
          这个
        ）;
      };
    }
    Object.defineProperty（target，key，sharedPropertyDefinition）;
  }

  function createComputedGetter（key）{
    return function computedGetter（）{
      var watcher = this._computedWatchers && this._computedWatchers [key];
      if（watcher）{
        if（watcher.dirty）{
          watcher.evaluate（）;
        }
        if（Dep.target）{
          watcher.depend（）;
        }
        返回watcher.value
      }
    }
  }

  function createGetterInvoker（fn）{
    return function computedGetter（）{
      return fn.call（this，this）
    }
  }

  function initMethods（vm，methods）{
    var props = vm。$ options.props;
    for（方法中的var键）{
      {
        if（typeof methods [key]！=='function'）{
          警告（
            “Method \”“+ key +”\“在组件定义中有类型\”“+（typeof methods [key]）+”\“。”+
            “你有没有正确地引用这个功能？”，
            VM
          ）;
        }
        if（props && hasOwn（props，key））{
          警告（
            （“Method \”“+ key +”\“已被定义为道具。”），
            VM
          ）;
        }
        if（（键入vm）&& isReserved（key））{
          警告（
            “Method \”“+ key +”\“与现有的Vue实例方法冲突。”+
            “避免定义以_或$开头的组件方法。”
          ）;
        }
      }
      vm [key] = typeof方法[key]！=='function'？noop：bind（methods [key]，vm）;
    }
  }

  函数initWatch（vm，watch）{
    for（观看中的var键）{
      var handler = watch [key];
      if（Array.isArray（handler））{
        for（var i = 0; i <handler.length; i ++）{
          createWatcher（vm，key，handler [i]）;
        }
      } else {
        createWatcher（vm，key，handler）;
      }
    }
  }

  function createWatcher（
    VM，
    expOrFn，
    处理程序，
    选项
  ）{
    if（isPlainObject（handler））{
      options = handler;
      handler = handler.handler;
    }
    if（typeof handler ==='string'）{
      handler = vm [handler];
    }
    return vm。$ watch（expOrFn，handler，options）
  }

  function stateMixin（Vue）{
    //流以某种方式存在直接声明的定义对象的问题
    //当使用Object.defineProperty时，我们必须在程序上建立
    //这里的对象
    var dataDef = {};
    dataDef.get = function（）{return this._data};
    var propsDef = {};
    propsDef.get = function（）{return this._props};
    {
      dataDef.set = function（）{
        警告（
          '避免替换实例根$ data。'+
          '改为使用嵌套数据属性。'，
          这个
        ）;
      };
      propsDef.set = function（）{
        警告（“$ props是readonly。”，这个）;
      };
    }
    Object.defineProperty（Vue.prototype，'$ data'，dataDef）;
    Object.defineProperty（Vue.prototype，'$ props'，propsDef）;

    Vue.prototype。$ set = set;
    Vue.prototype。$ delete = del;

    Vue.prototype。$ watch = function（
      expOrFn，
      CB，
      选项
    ）{
      var vm = this;
      if（isPlainObject（cb））{
        return createWatcher（vm，expOrFn，cb，options）
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher（vm，expOrFn，cb，options）;
      if（options.immediate）{
        尝试{
          cb.call（vm，watcher.value）;
        } catch（error）{
          handleError（错误，vm，（“立即观察者回调”“+（watcher.expression）+”\“”））;
        }
      }
      return函数unwatchFn（）{
        watcher.teardown（）;
      }
    };
  }

  / * * /

  var uid $ 3 = 0;

  function initMixin（Vue）{
    Vue.prototype._init = function（options）{
      var vm = this;
      //一个孩子
      vm._uid = uid $ 3 ++;

      var startTag，endTag;
      / *伊斯坦布尔忽略如果* /
      if（config.performance && mark）{
        startTag =“vue-perf-start：”+（vm._uid）;
        endTag =“vue-perf-end：”+（vm._uid）;
        标记（STARTTAG）;
      }

      //一个标志，以避免被观察到
      vm._isVue = true;
      //合并选项
      if（options && options._isComponent）{
        //优化内部组件实例化
        //因为动态选项合并非常慢，而且没有
        //内部组件选项需要特殊处理。
        initInternalComponent（vm，options）;
      } else {
        vm。$ options = mergeOptions（
          resolveConstructorOptions（vm.constructor），
          选项|| {}，
          VM
        ）;
      }
      / * istanbul忽略其他* /
      {
        initProxy（VM）;
      }
      //揭露真实的自我
      vm._self = vm;
      initLifecycle（VM）;
      initEvents（VM）;
      initRender（VM）;
      callHook（vm，'beforeCreate'）;
      initInjections（VM）; //在数据/道具之前解决注入
      INITSTATE（VM）;
      initProvide（VM）; //解析后提供数据/道具
      callHook（vm，'created'）;

      / *伊斯坦布尔忽略如果* /
      if（config.performance && mark）{
        vm._name = formatComponentName（vm，false）;
        标记（ENDTAG）;
        measure（（“vue”+（vm._name）+“init”），startTag，endTag）;
      }

      if（vm。$ options.el）{
        VM $安装（VM $ options.el）。
      }
    };
  }

  function initInternalComponent（vm，options）{
    var opts = vm。$ options = Object.create（vm.constructor.options）;
    //这样做是因为它比动态枚举更快。
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if（options.render）{
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions（Ctor）{
    var options = Ctor.options;
    if（Ctor.super）{
      var superOptions = resolveConstructorOptions（Ctor.super）;
      var cachedSuperOptions = Ctor.superOptions;
      if（superOptions！== cachedSuperOptions）{
        //超级选项已更改，
        //需要解决新选项
        Ctor.superOptions = superOptions;
        //检查是否有任何后期修改/附加选项（＃4976）
        var modifiedOptions = resolveModifiedOptions（Ctor）;
        //更新基本扩展选项
        if（modifiedOptions）{
          extend（Ctor.extendOptions，modifiedOptions）;
        }
        options = Ctor.options = mergeOptions（superOptions，Ctor.extendOptions）;
        if（options.name）{
          options.components [options.name] = Ctor;
        }
      }
    }
    返回选项
  }

  function resolveModifiedOptions（Ctor）{
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for（最近的var键）{
      if（最新[key]！== sealed [key]）{
        if（！modified）{modified = {}; }
        修改[key] =最新[key];
      }
    }
    返回修改
  }

  function Vue（options）{
    if（！（此实例为Vue）
    ）{
      warn（'Vue是一个构造函数，应该使用`new`关键字'调用）;
    }
    this._init（选项）;
  }

  initMixin（Vue公司）;
  stateMixin（Vue公司）;
  eventsMixin（Vue公司）;
  lifecycleMixin（Vue公司）;
  renderMixin（Vue公司）;

  / * * /

  function initUse（Vue）{
    Vue.use = function（plugin）{
      var installedPlugins =（this._installedPlugins ||（this._installedPlugins = []））;
      if（installedPlugins.indexOf（plugin）> -1）{
        归还这个
      }

      //其他参数
      var args = toArray（arguments，1）;
      args.unshift（本）;
      if（typeof plugin.install ==='function'）{
        plugin.install.apply（plugin，args）;
      } else if（typeof plugin ==='function'）{
        plugin.apply（null，args）;
      }
      installedPlugins.push（插件）;
      归还这个
    };
  }

  / * * /

  function initMixin $ 1（Vue）{
    Vue.mixin = function（mixin）{
      this.options = mergeOptions（this.options，mixin）;
      归还这个
    };
  }

  / * * /

  function initExtend（Vue）{
    / **
     *每个实例构造函数（包括Vue）都具有唯一性
     * cid。这使我们能够创造包裹的“孩子”
     *构造函数“用于原型继承并缓存它们。
     * /
    Vue.cid = 0;
    var cid = 1;

    / **
     *类继承
     * /
    Vue.extend = function（extendOptions）{
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || （extendOptions._Ctor = {}）;
      if（cachedCtors [SuperId]）{
        return cachedCtors [SuperId]
      }

      var name = extendOptions.name || Super.options.name;
      if（name）{
        validateComponentName（名称）;
      }

      var Sub = function VueComponent（options）{
        this._init（选项）;
      };
      Sub.prototype = Object.create（Super.prototype）;
      Sub.prototype.constructor = Sub;
      Sub.cid = cid ++;
      Sub.options = mergeOptions（
        Super.options，
        extendOptions
      ）;
      Sub ['super'] =超级;

      //对于props和computed属性，我们定义了代理getter
      //扩展时的Vue实例，在扩展原型上。这个
      //为每个创建的实例避免Object.defineProperty调用。
      if（Sub.options.props）{
        initProps $ 1（子）;
      }
      if（Sub.options.computed）{
        initComputed $ 1（子）;
      }

      //允许进一步扩展/ mixin /插件使用
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      //创建资产寄存器，以便扩展类
      //也可以拥有自己的私有资产。
      ASSET_TYPES.forEach（function（type）{
        Sub [type] = Super [type];
      }）;
      //启用递归自查找
      if（name）{
        Sub.options.components [name] = Sub;
      }

      //在扩展时保留对超级选项的引用。
      //稍后在实例化时我们可以检查Super的选项是否有
      //已更新
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend（{}，Sub.options）;

      //缓存构造函数
      cachedCtors [SuperId] = Sub;
      返回Sub
    };
  }

  function initProps $ 1（Comp）{
    var props = Comp.options.props;
    for（在道具中使用var键）{
      proxy（Comp.prototype，“_ props”，key）;
    }
  }

  function initComputed $ 1（Comp）{
    var computed = Comp.options.computed;
    for（var key in computed）{
      defineComputed（Comp.prototype，key，computed [key]）;
    }
  }

  / * * /

  function initAssetRegisters（Vue）{
    / **
     *创建资产注册方法。
     * /
    ASSET_TYPES.forEach（function（type）{
      Vue [type] =功能（
        ID，
        定义
      ）{
        if（！definition）{
          返回this.options [type +'s'] [id]
        } else {
          / *伊斯坦布尔忽略如果* /
          if（type ==='component'）{
            validateComponentName（ID）;
          }
          if（type ==='component'&& isPlainObject（definition））{
            definition.name = definition.name || ID;
            definition = this.options._base.extend（definition）;
          }
          if（type ==='directive'&& typeof definition ==='function'）{
            definition = {bind：definition，update：definition};
          }
          this.options [type +'s'] [id] =定义;
          返回定义
        }
      };
    }）;
  }

  / * * /



  function getComponentName（opts）{
    return opts &&（opts.Ctor.options.name || opts.tag）
  }

  函数匹配（模式，名称）{
    if（Array.isArray（pattern））{
      return pattern.indexOf（name）> -1
    } else if（typeof pattern ==='string'）{
      return pattern.split（'，'）。indexOf（name）> -1
    } else if（isRegExp（pattern））{
      return pattern.test（name）
    }
    / * istanbul忽略下一个* /
    返回false
  }

  function pruneCache（keepAliveInstance，filter）{
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for（缓存中的var键）{
      var cachedNode = cache [key];
      if（cachedNode）{
        var name = getComponentName（cachedNode.componentOptions）;
        if（name &&！filter（name））{
          pruneCacheEntry（cache，key，keys，_vnode）;
        }
      }
    }
  }

  function pruneCacheEntry（
    缓存，
    键，
    键，
    当前
  ）{
    var cached $$ 1 = cache [key];
    if（缓存$$ 1 &&（！current || cached $$ 1.tag！== current.tag））{
      。缓存$$ 1.componentInstance $ destroy（）方法;
    }
    cache [key] = null;
    删除（键，键）;
  }

  var patternTypes = [String，RegExp，Array];

  var KeepAlive = {
    名称：'keep-alive'，
    摘要：是的，

    道具： {
      include：patternTypes，
      exclude：patternTypes，
      max：[String，Number]
    }，

    created：function created（）{
      this.cache = Object.create（null）;
      this.keys = [];
    }，

    销毁：function destroyed（）{
      for（此.cache中的var键）{
        pruneCacheEntry（this.cache，key，this.keys）;
      }
    }，

    已安装：function mounted（）{
      var这$ 1 =这个;

      这个。$ watch（'include'，function（val）{
        pruneCache（这个$ 1，函数（名称）{返回匹配（val，name）;}）;
      }）;
      这个。$ watch（'exclude'，function（val）{
        pruneCache（这个$ 1，函数（名称）{return！matches（val，name）;}）;
      }）;
    }，

    render：function render（）{
      var slot = this。$ slots.default;
      var vnode = getFirstComponentChild（slot）;
      var componentOptions = vnode && vnode.componentOptions;
      if（componentOptions）{
        //检查模式
        var name = getComponentName（componentOptions）;
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        如果（
          // 不包含
          （包括&&（！name ||！matches（include，name）））||
          //排除
          （排除&& name &&匹配（排除，名称））
        ）{
          返回vnode
        }

        var ref $ 1 = this;
        var cache = ref $ 1.cache;
        var keys = ref $ 1.keys;
        var key = vnode.key == null
          //相同的构造函数可能会注册为不同的本地组件
          //所以仅靠cid是不够的（＃3269）
          ？componentOptions.Ctor.cid +（componentOptions.tag？（“”::“+（componentOptions.tag））：''）
          ：vnode.key;
        if（cache [key]）{
          vnode.componentInstance = cache [key] .componentInstance;
          //使当前密钥最新鲜
          删除（键，键）;
          keys.push（键）;
        } else {
          cache [key] = vnode;
          keys.push（键）;
          //修剪最古老的条目
          if（this.max && keys.length> parseInt（this.max））{
            pruneCacheEntry（cache，keys [0]，keys，this._vnode）;
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || （slot && slot [0]）
    }
  };

  var builtInComponents = {
    KeepAlive：KeepAlive
  };

  / * * /

  function initGlobalAPI（Vue）{
    //配置
    var configDef = {};
    configDef.get = function（）{return config; };
    {
      configDef.set = function（）{
        警告（
          '不要替换Vue.config对象，而是设置单个字段。
        ）;
      };
    }
    Object.defineProperty（Vue，'config'，configDef）;

    //公开的util方法。
    //注意：这些不被视为公共API的一部分 - 避免依赖
    //他们除非你知道风险。
    Vue.util = {
      警告：警告，
      延伸：延伸，
      mergeOptions：mergeOptions，
      defineReactive：defineReactive $$ 1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6显式可观察API
    Vue.observable = function（obj）{
      观察（OBJ）;
      返回obj
    };

    Vue.options = Object.create（null）;
    ASSET_TYPES.forEach（function（type）{
      Vue.options [type +'s'] = Object.create（null）;
    }）;

    //这用于标识“基础”构造函数以扩展所有普通对象
    // Weex的多实例场景中的组件。
    Vue.options._base = Vue;

    extend（Vue.options.components，builtInComponents）;

    initUse（Vue公司）;
    initMixin $ 1（Vue公司）;
    initExtend（Vue公司）;
    initAssetRegisters（Vue公司）;
  }

  initGlobalAPI（Vue公司）;

  Object.defineProperty（Vue.prototype，'$ isServer'，{
    get：isServerRendering
  }）;

  Object.defineProperty（Vue.prototype，'$ ssrContext'，{
    get：function get（）{
      / * istanbul忽略下一个* /
      返回此。$ vnode && this。$ vnode.ssrContext
    }
  }）;

  //为ssr运行时助手安装公开FunctionalRenderContext
  Object.defineProperty（Vue，'FunctionalRenderContext'，{
    value：FunctionalRenderContext
  }）;

  Vue.version ='2.6.10';

  / * * /

  //这些是为web保留的，因为它们是直接编译的
  //在模板编译期间
  var isReservedAttr = makeMap（'style，class'）;

  //应该使用props进行绑定的属性
  var acceptValue = makeMap（'input，textarea，option，select，progress'）;
  var mustUseProp = function（tag，type，attr）{
    回来（
      （attr ==='value'&& acceptValue（tag））&& type！=='button'||
      （attr ==='selected' && tag ==='option'）||
      （attr ==='checked'&& tag ==='input'）||
      （attr ==='muted'&& tag ==='video'）
    ）
  };

  var isEnumeratedAttr = makeMap（'contenteditable，draggable，spellcheck'）;

  var isValidContentEditableValue = makeMap（'events，caret，typing，plaintext-only'）;

  var convertEnumeratedValue = function（key，value）{
    return isFalsyAttrValue（value）|| 值==='假'
      ？'假'
      //允许任意字符串值为contenteditable
      ：key ==='contenteditable'&& isValidContentEditableValue（value）
        ？值
        ：'真'
  };

  var isBooleanAttr = makeMap（
    'allowfullscreen，async，autofocus，autoplay，checked，compact，controls，declare，'+
    'default，defaultchecked，defaultmuted，defaultselected，defer，disabled，'+
    '启用，formnovalidate，隐藏，不确定，惰性，ismap，itemscope，循环，多个，'+
    '静音，nohref，noresize，noshade，novalidate，nowrap，open，pauseonexit，readonly，'+
    '必需，反转，范围，无缝，选择，可排序，翻译，'+
    'truespeed，typemustmatch，可见'
  ）;

  var xlinkNS ='http://www.w3.org/1999/xlink';

  var isXlink = function（name）{
    return name.charAt（5）==='：'&& name.slice（0,5）==='xlink'
  };

  var getXlinkProp = function（name）{
    return isXlink（name）？name.slice（6，name.length）：''
  };

  var isFalsyAttrValue = function（val）{
    return val == null || val === false
  };

  / * * /

  function genClassForVnode（vnode）{
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while（isDef（childNode.componentInstance））{
      childNode = childNode.componentInstance._vnode;
      if（childNode && childNode.data）{
        data = mergeClassData（childNode.data，data）;
      }
    }
    while（isDef（parentNode = parentNode.parent））{
      if（parentNode && parentNode.data）{
        data = mergeClassData（data，parentNode.data）;
      }
    }
    返回renderClass（data.staticClass，data.class）
  }

  function mergeClassData（child，parent）{
    返回{
      staticClass：concat（child.staticClass，parent.staticClass），
      class：isDef（child.class）
        ？[child.class，parent.class]
        ：parent.class
    }
  }

  function renderClass（
    staticClass，
    dynamicClass
  ）{
    if（isDef（staticClass）|| isDef（dynamicClass））{
      return concat（staticClass，stringifyClass（dynamicClass））
    }
    / * istanbul忽略下一个* /
    回归''
  }

  function concat（a，b）{
    回来了？b？（a +''+ b）：a：（b ||''）
  }

  function stringifyClass（value）{
    if（Array.isArray（value））{
      return stringifyArray（value）
    }
    if（isObject（value））{
      return stringifyObject（value）
    }
    if（typeof value ==='string'）{
      回报价值
    }
    / * istanbul忽略下一个* /
    回归''
  }

  function stringifyArray（value）{
    var res ='';
    var stringified;
    for（var i = 0，l = value.length; i <l; i ++）{
      if（isDef（stringified = stringifyClass（value [i]））&& stringified！==''）{
        if（res）{res + =''; }
        res + =字符串化;
      }
    }
    返回资源
  }

  function stringifyObject（value）{
    var res ='';
    for（var key in value）{
      if（value [key]）{
        if（res）{res + =''; }
        res + = key;
      }
    }
    返回资源
  }

  / * * /

  var namespaceMap = {
    svg：'http://www.w3.org/2000/svg'，
    数学：'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap（
    'html，body，base，head，link，meta，style，title，'+
    '地址，文章，旁边，页脚，标题，h1，h2，h3，h4，h5，h6，hgroup，nav，section，'+
    'div，dd，dl，dt，figcaption，figure，picture，hr，img，li，main，ol，p，pre，ul，'+
    'a，b，abbr，bdi，bdo，br，cite，code，data，dfn，em，i，kbd，mark，q，rp，rt，rtc，ruby，'+
    's，samp，small，span，strong，sub，sup，time，u，var，wbr，area，audio，map，track，video，'+
    'embed，object，param，source，canvas，script，noscript，del，ins，'+
    'caption，col，colgroup，table，thead，tbody，td，th，tr，'+
    '按钮，datalist，fieldset，窗体，输入，标签，图例，仪表，optgroup，选项，'+
    '输出，进度，选择，textarea，'+
    '详细信息，对话框，菜单，菜单项，摘要，'+
    '内容，元素，阴影，模板，块引用，iframe中，TFOOT'
  ）;

  //此地图是有意选择的，仅涵盖可能的SVG元素
  //包含子元素。
  var isSVG = makeMap（
    'svg，animate，circle，clippath，cursor，defs，desc，ellipse，filter，font-face，'+
    'foreignObject，g，glyph，image，line，marker，mask，missing-glyph，path，pattern，'+
    '多边形，折线，矩形，开关，符号，文字，textpath，TSPAN，使用，视图'，
    真正
  ）;

  var isPreTag = function（tag）{return tag ==='pre'; };

  var isReservedTag = function（tag）{
    return isHTMLTag（tag）|| isSVG（标签）
  };

  function getTagNamespace（tag）{
    if（isSVG（tag））{
      返回'svg'
    }
    //对MathML的基本支持
    //注意它不支持其他MathML元素作为组件根
    if（tag ==='math'）{
      返回'数学'
    }
  }

  var unknownElementCache = Object.create（null）;
  function isUnknownElement（tag）{
    / *伊斯坦布尔忽略如果* /
    if（！inBrowser）{
      返回true
    }
    if（isReservedTag（tag））{
      返回false
    }
    tag = tag.toLowerCase（）;
    / *伊斯坦布尔忽略如果* /
    if（unknownElementCache [tag]！= null）{
      return unknownElementCache [tag]
    }
    var el = document.createElement（tag）;
    if（tag.indexOf（' - '）> -1）{
      // http://stackoverflow.com/a/28210364/1070244
      return（unknownElementCache [tag] =（
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ））
    } else {
      return（unknownElementCache [tag] = /HTMLUnknownElement/.test(el.toString（）））
    }
  }

  var isTextInputType = makeMap（'text，number，password，search，email，tel，url'）;

  / * * /

  / **
   *如果元素选择器不是元素，则查询它。
   * /
  function query（el）{
    if（typeof el ==='string'）{
      var selected = document.querySelector（el）;
      if（！selected）{
        警告（
          '找不到元素：'+ el
        ）;
        return document.createElement（'div'）
      }
      返回选中
    } else {
      返回el
    }
  }

  / * * /

  function createElement $ 1（tagName，vnode）{
    var elm = document.createElement（tagName）;
    if（tagName！=='select'）{
      回归榆树
    }
    // false或null将删除该属性，但undefined将不会
    if（vnode.data && vnode.data.attrs && vnode.data.attrs.multiple！== undefined）{
      elm.setAttribute（'multiple'，'multiple'）;
    }
    回归榆树
  }

  function createElementNS（namespace，tagName）{
    return document.createElementNS（namespaceMap [namespace]，tagName）
  }

  function createTextNode（text）{
    return document.createTextNode（text）
  }

  function createComment（text）{
    return document.createComment（text）
  }

  function insertBefore（parentNode，newNode，referenceNode）{
    parentNode.insertBefore（newNode，referenceNode）;
  }

  function removeChild（node，child）{
    node.removeChild（孩子）;
  }

  function appendChild（node，child）{
    node.appendChild（孩子）;
  }

  function parentNode（node）{
    return node.parentNode
  }

  function nextSibling（node）{
    return node.nextSibling
  }

  function tagName（node）{
    return node.tagName
  }

  function setTextContent（node，text）{
    node.textContent = text;
  }

  function setStyleScope（node，scopeId）{
    node.setAttribute（scopeId，''）;
  }

  var nodeOps = / * #__ PURE __ * / Object.freeze（{
    createElement：createElement $ 1，
    createElementNS：createElementNS，
    createTextNode：createTextNode，
    createComment：createComment，
    insertBefore：insertBefore，
    removeChild：removeChild，
    appendChild：appendChild，
    parentNode：parentNode，
    nextSibling：nextSibling，
    tagName：tagName，
    setTextContent：setTextContent，
    setStyleScope：setStyleScope
  }）;

  / * * /

  var ref = {
    create：function create（_，vnode）{
      registerRef（v节点）;
    }，
    更新：函数更新（oldVnode，vnode）{
      if（oldVnode.data.ref！== vnode.data.ref）{
        registerRef（oldVnode，true）;
        registerRef（v节点）;
      }
    }，
    destroy：function destroy（vnode）{
      registerRef（vnode，true）;
    }
  };

  function registerRef（vnode，isRemoval）{
    var key = vnode.data.ref;
    if（！isDef（key））{return}

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm。$ refs;
    if（isRemoval）{
      if（Array.isArray（refs [key]））{
        删除（refs [key]，ref）;
      } else if（refs [key] === ref）{
        refs [key] = undefined;
      }
    } else {
      if（vnode.data.refInFor）{
        if（！Array.isArray（refs [key]））{
          refs [key] = [ref];
        } else if（refs [key] .indexOf（ref）<0）{
          // $ flow-disable-line
          参考文献[键] .push（REF）;
        }
      } else {
        refs [key] = ref;
      }
    }
  }

  / **
   *基于Snabbdom的虚拟DOM修补算法
   * Simon Friis Vindum（@paldepind）
   *根据MIT许可证获得许可
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   *由Evan You修改（@ yyx990803）
   *
   *不进行类型检查，因为这个文件是完全关键的和成本
   *使流程理解它是不值得的。
   * /

  var emptyNode = new VNode（''，{}，[]）;

  var hooks = ['create'，'activate'，'update'，'remove'，'destroy'];

  function sameVnode（a，b）{
    回来（
      a.key === b.key &&（
        （
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef（a.data）=== isDef（b.data）&&
          sameInputType（a，b）
        ）|| （
          isTrue（a.isAsyncPlaceholder）&&
          a.asyncFactory === b.asyncFactory &&
          isUndef（b.asyncFactory.error）
        ）
      ）
    ）
  }

  function sameInputType（a，b）{
    if（a.tag！=='input'）{return true}
    var i;
    var typeA = isDef（i = a.data）&& isDef（i = i.attrs）&& i.type;
    var typeB = isDef（i = b.data）&& isDef（i = i.attrs）&& i.type;
    return typeA === typeB || isTextInputType（typeA）&& isTextInputType（typeB）
  }

  function createKeyToOldIdx（children，beginIdx，endIdx）{
    var i，key;
    var map = {};
    for（i = beginIdx; i <= endIdx; ++ i）{
      key = children [i] .key;
      if（isDef（key））{map [key] = i; }
    }
    返回地图
  }

  function createPatchFunction（backend）{
    var i，j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for（i = 0; i <hooks.length; ++ i）{
      cbs [hooks [i]] = [];
      for（j = 0; j <modules.length; ++ j）{
        if（isDef（modules [j] [hooks [i]]））{
          。CBS [钩[I]]推（模块[J] [钩[I]]）;
        }
      }
    }

    function emptyNodeAt（elm）{
      返回新的VNode（nodeOps.tagName（elm）.toLowerCase（），{}，[]，undefined，elm）
    }

    function createRmCb（childElm，listeners）{
      function remove $$ 1（）{
        if（--remove $$ 1.listeners === 0）{
          的removeNode（childElm）;
        }
      }
      remove $$ 1.listeners = listeners;
      return remove $$ 1
    }

    function removeNode（el）{
      var parent = nodeOps.parentNode（el）;
      //元素可能已被删除，因为v-html / v-text
      if（isDef（parent））{
        nodeOps.removeChild（parent，el）;
      }
    }

    function isUnknownElement $$ 1（vnode，inVPre）{
      回来（
        ！inVPre &&
        ！vnode.ns &&
        ！（
          config.ignoredElements.length &&
          config.ignoredElements.some（function（ignore）{
            return isRegExp（忽略）
              ？ignore.test（vnode.tag）
              ：ignore === vnode.tag
          }）
        ）&&
        config.isUnknownElement（vnode.tag）
      ）
    }

    var creatingElmInVPre = 0;

    function createElm（
      虚拟节点，
      insertedVnodeQueue，
      parentElm，
      refElm，
      嵌套，
      ownerArray，
      指数
    ）{
      if（isDef（vnode.elm）&& isDef（ownerArray））{
        //这个vnode用于之前的渲染！
        //现在它被用作新节点，覆盖它的榆树会导致
        //当它用作插入时，潜在的补丁错误
        //参考节点。相反，我们在创建之前按需克隆节点
        //为它关联的DOM元素。
        vnode = ownerArray [index] = cloneVNode（vnode）;
      }

      vnode.isRootInsert =！nested; //用于转换输入检查
      if（createComponent（vnode，insertedVnodeQueue，parentElm，refElm））{
        返回
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if（isDef（tag））{
        {
          if（data && data.pre）{
            creatingElmInVPre ++;
          }
          if（isUnknownElement $$ 1（vnode，creatingElmInVPre））{
            警告（
              '未知的自定义元素：<'+ tag +'>  - 你有没有+
              '正确注册组件？对于递归组件，'+
              '确保提供“名称”选项。'，
              vnode.context
            ）;
          }
        }

        vnode.elm = vnode.ns
          ？nodeOps.createElementNS（vnode.ns，tag）
          ：nodeOps.createElement（tag，vnode）;
        setScope（v节点）;

        / *伊斯坦布尔忽略如果* /
        {
          createChildren（vnode，children，insertedVnodeQueue）;
          if（isDef（data））{
            invokeCreateHooks（vnode，insertedVnodeQueue）;
          }
          insert（parentElm，vnode.elm，refElm）;
        }

        if（data && data.pre）{
          creatingElmInVPre--;
        }
      } else if（isTrue（vnode.isComment））{
        vnode.elm = nodeOps.createComment（vnode.text）;
        insert（parentElm，vnode.elm，refElm）;
      } else {
        vnode.elm = nodeOps.createTextNode（vnode.text）;
        insert（parentElm，vnode.elm，refElm）;
      }
    }

    function createComponent（vnode，insertedVnodeQueue，parentElm，refElm）{
      var i = vnode.data;
      if（isDef（i））{
        var isReactivated = isDef（vnode.componentInstance）&& i.keepAlive;
        if（isDef（i = i.hook）&& isDef（i = i.init））{
          我（vnode，false / *保湿* /）;
        }
        //在调用init钩子之后，如果vnode是子组件
        //它应该创建一个子实例并安装它。孩子
        // component还设置了占位符vnode的elm。
        //在这种情况下，我们可以返回元素并完成。
        if（isDef（vnode.componentInstance））{
          initComponent（vnode，insertedVnodeQueue）;
          insert（parentElm，vnode.elm，refElm）;
          if（isTrue（isReactivated））{
            reactivateComponent（vnode，insertedVnodeQueue，parentElm，refElm）;
          }
          返回true
        }
      }
    }

    function initComponent（vnode，insertedVnodeQueue）{
      if（isDef（vnode.data.pendingInsert））{
        insertedVnodeQueue.push.apply（insertedVnodeQueue，vnode.data.pendingInsert）;
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance。$ el;
      if（isPatchable（vnode））{
        invokeCreateHooks（vnode，insertedVnodeQueue）;
        setScope（v节点）;
      } else {
        //空组件根。
        //跳过除ref之外的所有与元素相关的模块（＃3455）
        registerRef（v节点）;
        //确保调用insert hook
        insertedVnodeQueue.push（v节点）;
      }
    }

    function reactivateComponent（vnode，insertedVnodeQueue，parentElm，refElm）{
      var i;
      // hack for＃4339：具有内部转换的重新激活的组件
      //不会触发，因为没有调用内部节点创建的钩子
      //再一次 在这里涉及特定于模块的逻辑并不理想
      //似乎没有更好的方法来做到这一点。
      var innerNode = vnode;
      while（innerNode.componentInstance）{
        innerNode = innerNode.componentInstance._vnode;
        if（isDef（i = innerNode.data）&& isDef（i = i.transition））{
          for（i = 0; i <cbs.activate.length; ++ i）{
            cbs.activate [i]（emptyNode，innerNode）;
          }
          insertedVnodeQueue.push（innerNode）;
          打破
        }
      }
      //与新创建的组件不同，
      //重新激活的keep-alive组件不会插入自身
      insert（parentElm，vnode.elm，refElm）;
    }

    function insert（parent，elm，ref $$ 1）{
      if（isDef（parent））{
        if（isDef（ref $$ 1））{
          if（nodeOps.parentNode（ref $$ 1）=== parent）{
            nodeOps.insertBefore（parent，elm，ref $$ 1）;
          }
        } else {
          nodeOps.appendChild（parent，elm）;
        }
      }
    }

    function createChildren（vnode，children，insertedVnodeQueue）{
      if（Array.isArray（children））{
        {
          checkDuplicateKeys（儿童）;
        }
        for（var i = 0; i <children.length; ++ i）{
          createElm（children [i]，insertedVnodeQueue，vnode.elm，null，true，children，i）;
        }
      } else if（isPrimitive（vnode.text））{
        nodeOps.appendChild（vnode.elm，nodeOps.createTextNode（String（vnode.text）））;
      }
    }

    function isPatchable（vnode）{
      while（vnode.componentInstance）{
        vnode = vnode.componentInstance._vnode;
      }
      return isDef（vnode.tag）
    }

    function invokeCreateHooks（vnode，insertedVnodeQueue）{
      for（var i $ 1 = 0; i $ 1 <cbs.create.length; ++ i $ 1）{
        cbs.create [i $ 1]（emptyNode，vnode）;
      }
      i = vnode.data.hook; //重用变量
      if（isDef（i））{
        if（isDef（i.create））{i.create（emptyNode，vnode）; }
        if（isDef（i.insert））{insertedVnodeQueue.push（vnode）; }
      }
    }

    //为范围CSS设置范围id属性。
    //这是作为特殊情况实现的，以避免开销
    //通过正常的属性修补过程。
    function setScope（vnode）{
      var i;
      if（isDef（i = vnode.fnScopeId））{
        nodeOps.setStyleScope（vnode.elm，i）;
      } else {
        var ancestor = vnode;
        while（祖先）{
          if（isDef（i = ancestor.context）&& isDef（i = i。$ options._scopeId））{
            nodeOps.setStyleScope（vnode.elm，i）;
          }
          ancestor = ancestor.parent;
        }
      }
      //对于插槽内容，他们还应该从主机实例获取scopeId。
      if（isDef（i = activeInstance）&&
        我！== vnode.context &&
        我！== vnode.fnContext &&
        isDef（i = i。$ options._scopeId）
      ）{
        nodeOps.setStyleScope（vnode.elm，i）;
      }
    }

    function addVnodes（parentElm，refElm，vnodes，startIdx，endIdx，insertedVnodeQueue）{
      for（; startIdx <= endIdx; ++ startIdx）{
        createElm（vnodes [startIdx]，insertedVnodeQueue，parentElm，refElm，false，vnodes，startIdx）;
      }
    }

    function invokeDestroyHook（vnode）{
      var i，j;
      var data = vnode.data;
      if（isDef（data））{
        if（isDef（i = data.hook）&& isDef（i = i.destroy））{i（vnode）; }
        for（i = 0; i <cbs.destroy.length; ++ i）{cbs.destroy [i]（vnode）; }
      }
      if（isDef（i = vnode.children））{
        for（j = 0; j <vnode.children.length; ++ j）{
          invokeDestroyHook（vnode.children [J]）;
        }
      }
    }

    function removeVnodes（parentElm，vnodes，startIdx，endIdx）{
      for（; startIdx <= endIdx; ++ startIdx）{
        var ch = vnodes [startIdx];
        if（isDef（ch））{
          if（isDef（ch.tag））{
            removeAndInvokeRemoveHook（CH）;
            invokeDestroyHook（CH）;
          } else {//文本节点
            的removeNode（ch.elm）;
          }
        }
      }
    }

    function removeAndInvokeRemoveHook（vnode，rm）{
      if（isDef（rm）|| isDef（vnode.data））{
        var i;
        var listeners = cbs.remove.length + 1;
        if（isDef（rm））{
          //我们有一个递归传递的rm回调
          //增加侦听器数量
          rm.listeners + =听众;
        } else {
          //直接删除
          rm = createRmCb（vnode.elm，listeners）;
        }
        //以递归方式调用子组件根节点上的挂钩
        if（isDef（i = vnode.componentInstance）&& isDef（i = i._vnode）&& isDef（i.data））{
          removeAndInvokeRemoveHook（i，rm）;
        }
        for（i = 0; i <cbs.remove.length; ++ i）{
          cbs.remove [i]（vnode，rm）;
        }
        if（isDef（i = vnode.data.hook）&& isDef（i = i.remove））{
          我（vnode，rm）;
        } else {
          R M（）;
        }
      } else {
        的removeNode（vnode.elm）;
      }
    }

    function updateChildren（parentElm，oldCh，newCh，insertedVnodeQueue，removeOnly）{
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length  -  1;
      var oldStartVnode = oldCh [0];
      var oldEndVnode = oldCh [oldEndIdx];
      var newEndIdx = newCh.length  -  1;
      var newStartVnode = newCh [0];
      var newEndVnode = newCh [newEndIdx];
      var oldKeyToIdx，idxInOld，vnodeToMove，refElm;

      // removeOnly是仅由<transition-group>使用的特殊标志
      //确保删除的元素保持正确的相对位置
      //在离开过渡期间
      var canMove =！removeOnly;

      {
        checkDuplicateKeys（newCh）;
      }

      while（oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx）{
        if（isUndef（oldStartVnode））{
          oldStartVnode = oldCh [++ oldStartIdx]; // Vnode已向左移动
        } else if（isUndef（oldEndVnode））{
          oldEndVnode = oldCh [ -  oldEndIdx];
        } else if（sameVnode（oldStartVnode，newStartVnode））{
          patchVnode（oldStartVnode，newStartVnode，insertedVnodeQueue，newCh，newStartIdx）;
          oldStartVnode = oldCh [++ oldStartIdx];
          newStartVnode = newCh [++ newStartIdx];
        } else if（sameVnode（oldEndVnode，newEndVnode））{
          patchVnode（oldEndVnode，newEndVnode，insertedVnodeQueue，newCh，newEndIdx）;
          oldEndVnode = oldCh [ -  oldEndIdx];
          newEndVnode = newCh [ -  newEndIdx];
        } else if（sameVnode（oldStartVnode，newEndVnode））{// Vnode向右移动
          patchVnode（oldStartVnode，newEndVnode，insertedVnodeQueue，newCh，newEndIdx）;
          canMove && nodeOps.insertBefore（parentElm，oldStartVnode.elm，nodeOps.nextSibling（oldEndVnode.elm））;
          oldStartVnode = oldCh [++ oldStartIdx];
          newEndVnode = newCh [ -  newEndIdx];
        } else if（sameVnode（oldEndVnode，newStartVnode））{// Vnode向左移动
          patchVnode（oldEndVnode，newStartVnode，insertedVnodeQueue，newCh，newStartIdx）;
          canMove && nodeOps.insertBefore（parentElm，oldEndVnode.elm，oldStartVnode.elm）;
          oldEndVnode = oldCh [ -  oldEndIdx];
          newStartVnode = newCh [++ newStartIdx];
        } else {
          if（isUndef（oldKeyToIdx））{oldKeyToIdx = createKeyToOldIdx（oldCh，oldStartIdx，oldEndIdx）; }
          idxInOld = isDef（newStartVnode.key）
            ？oldKeyToIdx [newStartVnode.key]
            ：findIdxInOld（newStartVnode，oldCh，oldStartIdx，oldEndIdx）;
          if（isUndef（idxInOld））{//新元素
            createElm（newStartVnode，insertedVnodeQueue，parentElm，oldStartVnode.elm，false，newCh，newStartIdx）;
          } else {
            vnodeToMove = oldCh [idxInOld];
            if（sameVnode（vnodeToMove，newStartVnode））{
              patchVnode（vnodeToMove，newStartVnode，insertedVnodeQueue，newCh，newStartIdx）;
              oldCh [idxInOld] =未定义;
              canMove && nodeOps.insertBefore（parentElm，vnodeToMove.elm，oldStartVnode.elm）;
            } else {
              //相同的键，但不同的元素。作为新元素对待
              createElm（newStartVnode，insertedVnodeQueue，parentElm，oldStartVnode.elm，false，newCh，newStartIdx）;
            }
          }
          newStartVnode = newCh [++ newStartIdx];
        }
      }
      if（oldStartIdx> oldEndIdx）{
        refElm = isUndef（newCh [newEndIdx + 1]）？null：newCh [newEndIdx + 1] .elm;
        addVnodes（parentElm，refElm，newCh，newStartIdx，newEndIdx，insertedVnodeQueue）;
      } else if（newStartIdx> newEndIdx）{
        removeVnodes（parentElm，oldCh，oldStartIdx，oldEndIdx）;
      }
    }

    function checkDuplicateKeys（children）{
      var seenKeys = {};
      for（var i = 0; i <children.length; i ++）{
        var vnode = children [i];
        var key = vnode.key;
        if（isDef（key））{
          if（seenKeys [key]）{
            警告（
              （“检测到重复键：'”+ +键+“'。这可能会导致更新错误。”），
              vnode.context
            ）;
          } else {
            seenKeys [key] = true;
          }
        }
      }
    }

    function findIdxInOld（node，oldCh，start，end）{
      for（var i = start; i <end; i ++）{
        var c = oldCh [i];
        if（isDef（c）&& sameVnode（node，c））{return i}
      }
    }

    function patchVnode（
      oldVnode，
      虚拟节点，
      insertedVnodeQueue，
      ownerArray，
      指数，
      仅删除
    ）{
      if（oldVnode === vnode）{
        返回
      }

      if（isDef（vnode.elm）&& isDef（ownerArray））{
        // clone reused vnode
        vnode = ownerArray [index] = cloneVNode（vnode）;
      }

      var elm = vnode.elm = oldVnode.elm;

      if（isTrue（oldVnode.isAsyncPlaceholder））{
        if（isDef（vnode.asyncFactory.resolved））{
          hydrate（oldVnode.elm，vnode，insertedVnodeQueue）;
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        返回
      }

      //重用静态树的元素。
      //注意我们只在克隆vnode时才这样做 -
      //如果没有克隆新节点，则表示渲染函数已经存在
      //由hot-reload-api重置，我们需要进行适当的重新渲染。
      if（isTrue（vnode.isStatic）&&
        isTrue（oldVnode.isStatic）&&
        vnode.key === oldVnode.key &&
        （isTrue（vnode.isCloned）|| isTrue（vnode.isOnce））
      ）{
        vnode.componentInstance = oldVnode.componentInstance;
        返回
      }

      var i;
      var data = vnode.data;
      if（isDef（data）&& isDef（i = data.hook）&& isDef（i = i.prepatch））{
        我（oldVnode，vnode）;
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if（isDef（data）&& isPatchable（vnode））{
        for（i = 0; i <cbs.update.length; ++ i）{cbs.update [i]（oldVnode，vnode）; }
        if（isDef（i = data.hook）&& isDef（i = i.update））{i（oldVnode，vnode）; }
      }
      if（isUndef（vnode.text））{
        if（isDef（oldCh）&& isDef（ch））{
          if（oldCh！== ch）{updateChildren（elm，oldCh，ch，insertedVnodeQueue，removeOnly）; }
        } else if（isDef（ch））{
          {
            checkDuplicateKeys（CH）;
          }
          if（isDef（oldVnode.text））{nodeOps.setTextContent（elm，''）; }
          addVnodes（elm，null，ch，0，ch.length  -  1，insertedVnodeQueue）;
        } else if（isDef（oldCh））{
          removeVnodes（elm，oldCh，0，oldCh.length  -  1）;
        } else if（isDef（oldVnode.text））{
          nodeOps.setTextContent（elm，''）;
        }
      } else if（oldVnode.text！== vnode.text）{
        nodeOps.setTextContent（elm，vnode.text）;
      }
      if（isDef（data））{
        if（isDef（i = data.hook）&& isDef（i = i.postpatch））{i（oldVnode，vnode）; }
      }
    }

    function invokeInsertHook（vnode，queue，initial）{
      //延迟组件根节点的插入挂钩，在之后调用它们
      //元素真的插入了
      if（isTrue（initial）&& isDef（vnode.parent））{
        vnode.parent.data.pendingInsert = queue;
      } else {
        for（var i = 0; i <queue.length; ++ i）{
          排队[I] .data.hook.insert（队列[I]）;
        }
      }
    }

    var hydrationBailed = false;
    //可以在水合过程中跳过创建钩子的模块列表，因为它们
    //已经在客户端上呈现或者不需要初始化
    //注意：样式被排除，因为它将来依赖于初始克隆
    //深度更新（＃7063）。
    var isRenderedModule = makeMap（'attrs，class，staticClass，staticStyle，key'）;

    //注意：这是一个仅限浏览器的函数，因此我们可以假设elms是DOM节点。
    function hydrate（elm，vnode，insertedVnodeQueue，inVPre）{
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || （data && data.pre）;
      vnode.elm = elm;

      if（isTrue（vnode.isComment）&& isDef（vnode.asyncFactory））{
        vnode.isAsyncPlaceholder = true;
        返回true
      }
      //断言节点匹配
      {
        if（！assertNodeMatch（elm，vnode，inVPre））{
          返回false
        }
      }
      if（isDef（data））{
        if（isDef（i = data.hook）&& isDef（i = i.init））{i（vnode，true / * hydrating * /）; }
        if（isDef（i = vnode.componentInstance））{
          //子组件 它应该为自己的树提供水分。
          initComponent（vnode，insertedVnodeQueue）;
          返回true
        }
      }
      if（isDef（tag））{
        if（isDef（children））{
          //空元素，允许客户端选择并填充子项
          if（！elm.hasChildNodes（））{
            createChildren（vnode，children，insertedVnodeQueue）;
          } else {
            // v-html和domProps：innerHTML
            if（isDef（i = data）&& isDef（i = i.domProps）&& isDef（i = i.innerHTML））{
              if（i！== elm.innerHTML）{
                / *伊斯坦布尔忽略如果* /
                if（typeof console！=='undefined'&&
                  ！hydrationBailed
                ）{
                  hydrationBailed = true;
                  console.warn（'Parent：'，elm）;
                  console.warn（'server innerHTML：'，i）;
                  console.warn（'client innerHTML：'，elm.innerHTML）;
                }
                返回false
              }
            } else {
              //迭代并比较子列表
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for（var i $ 1 = 0; i $ 1 <children.length; i $ 1 ++）{
                if（！childNode ||！hydrate（childNode，children [i $ 1]，insertedVnodeQueue，inVPre））{
                  childrenMatch = false;
                  打破
                }
                childNode = childNode.nextSibling;
              }
              //如果childNode不为null，则表示实际的childNodes列表为
              //比虚拟子列表长。
              if（！childrenMatch || childNode）{
                / *伊斯坦布尔忽略如果* /
                if（typeof console！=='undefined'&&
                  ！hydrationBailed
                ）{
                  hydrationBailed = true;
                  console.warn（'Parent：'，elm）;
                  console.warn（'mismatching childNodes vs. VNodes：'，elm.childNodes，children）;
                }
                返回false
              }
            }
          }
        }
        if（isDef（data））{
          var fullInvoke = false;
          for（数据中的var键）{
            if（！isRenderedModule（key））{
              fullInvoke = true;
              invokeCreateHooks（vnode，insertedVnodeQueue）;
              打破
            }
          }
          if（！fullInvoke && data ['class']）{
            //确保为深层绑定收集deps以供将来更新
            遍历（数据[ '类']）;
          }
        }
      } else if（elm.data！== vnode.text）{
        elm.data = vnode.text;
      }
      返回true
    }

    function assertNodeMatch（node，vnode，inVPre）{
      if（isDef（vnode.tag））{
        return vnode.tag.indexOf（'vue-component'）=== 0 || （
          ！isUnknownElement $$ 1（vnode，inVPre）&&
          vnode.tag.toLowerCase（）===（node.tagName && node.tagName.toLowerCase（））
        ）
      } else {
        return node.nodeType ===（vnode.isComment？8：3）
      }
    }

    返回函数补丁（oldVnode，vnode，hydrating，removeOnly）{
      if（isUndef（vnode））{
        if（isDef（oldVnode））{invokeDestroyHook（oldVnode）; }
        返回
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if（isUndef（oldVnode））{
        //空挂载（可能作为组件），创建新的根元素
        isInitialPatch = true;
        createElm（vnode，insertedVnodeQueue）;
      } else {
        var isRealElement = isDef（oldVnode.nodeType）;
        if（！isRealElement && sameVnode（oldVnode，vnode））{
          //修补现有的根节点
          patchVnode（oldVnode，vnode，insertedVnodeQueue，null，null，removeOnly）;
        } else {
          if（isRealElement）{
            //安装到真实元素
            //检查这是否是服务器呈现的内容以及我们是否可以执行
            //成功补水。
            if（oldVnode.nodeType === 1 && oldVnode.hasAttribute（SSR_ATTR））{
              oldVnode.removeAttribute（SSR_ATTR）;
              保湿=真;
            }
            if（isTrue（保湿））{
              if（hydrate（oldVnode，vnode，insertedVnodeQueue））{
                invokeInsertHook（vnode，insertedVnodeQueue，true）;
                返回oldVnode
              } else {
                警告（
                  '客户端呈现的虚拟DOM树不匹配'+
                  '服务器呈现的内容。这可能是由于'+'不正确造成的
                  'HTML标记，例如在'+中嵌套块级元素
                  '<p>，或者缺少<tbody>。白水化和表演'+
                  '完整的客户端渲染。'
                ）;
              }
            }
            //不是服务器渲染，也不是水合失败。
            //创建一个空节点并替换它
            oldVnode = emptyNodeAt（oldVnode）;
          }

          //替换现有元素
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode（oldElm）;

          //创建新节点
          createElm（
            虚拟节点，
            insertedVnodeQueue，
            //非常罕见的边缘情况：如果旧元素在a中，请不要插入
            //离开过渡 仅在合并transition +时才会发生
            // keep-alive + HOCs。（＃4590）
            oldElm._leaveCb？null：parentElm，
            nodeOps.nextSibling（oldElm）
          ）;

          //递归地更新父占位符节点元素
          if（isDef（vnode.parent））{
            var ancestor = vnode.parent;
            var patchable = isPatchable（vnode）;
            while（祖先）{
              for（var i = 0; i <cbs.destroy.length; ++ i）{
                cbs.destroy [I]（祖先）;
              }
              ancestor.elm = vnode.elm;
              if（patchable）{
                for（var i $ 1 = 0; i $ 1 <cbs.create.length; ++ i $ 1）{
                  cbs.create [i $ 1]（emptyNode，ancestor）;
                }
                //＃6513
                //调用可能已被create hooks合并的插入钩子。
                //例如，对于使用“inserted”钩子的指令。
                var insert = ancestor.data.hook.insert;
                if（insert.mer ged ）{
                  //从索引1开始，以避免重新调用组件挂载的钩子
                  for（var i $ 2 = 1; i $ 2 <insert.fns.length; i $ 2 ++）{
                    insert.fns [I $ 2]（）;
                  }
                }
              } else {
                registerRef（祖先）;
              }
              ancestor = ancestor.parent;
            }
          }

          //销毁旧节点
          if（isDef（parentElm））{
            removeVnodes（parentElm，[oldVnode]，0,0）;
          } else if（isDef（oldVnode.tag））{
            invokeDestroyHook（oldVnode）;
          }
        }
      }

      invokeInsertHook（vnode，insertedVnodeQueue，isInitialPatch）;
      return vnode.elm
    }
  }

  / * * /

  var directives = {
    create：updateDirectives，
    更新：updateDirectives，
    destroy：function unbindDirectives（vnode）{
      updateDirectives（vnode，emptyNode）;
    }
  };

  function updateDirectives（oldVnode，vnode）{
    if（oldVnode.data.directives || vnode.data.directives）{
      _update（oldVnode，vnode）;
    }
  }

  function _update（oldVnode，vnode）{
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives $ 1（oldVnode.data.directives，oldVnode.context）;
    var newDirs = normalizeDirectives $ 1（vnode.data.directives，vnode.context）;

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key，oldDir，dir;
    for（newDirs中的关键字）{
      oldDir = oldDirs [key];
      dir = newDirs [key];
      if（！oldDir）{
        //新指令，绑定
        callHook $ 1（dir，'bind'，vnode，oldVnode）;
        if（dir.def && dir.def.inserted）{
          dirsWithInsert.push（DIR）;
        }
      } else {
        //现有指令，更新
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook $ 1（dir，'update'，vnode，oldVnode）;
        if（dir.def && dir.def.componentUpdated）{
          dirsWithPostpatch.push（DIR）;
        }
      }
    }

    if（dirsWithInsert.length）{
      var callInsert = function（）{
        for（var i = 0; i <dirsWithInsert.length; i ++）{
          callHook $ 1（dirsWithInsert [i]，'inserted'，vnode，oldVnode）;
        }
      };
      if（isCreate）{
        mergeVNodeHook（vnode，'insert'，callInsert）;
      } else {
        callInsert（）;
      }
    }

    if（dirsWithPostpatch.length）{
      mergeVNodeHook（vnode，'postpatch'，function（）{
        for（var i = 0; i <dirsWithPostpatch.length; i ++）{
          callHook $ 1（dirsWithPostpatch [i]，'componentUpdated'，vnode，oldVnode）;
        }
      }）;
    }

    if（！isCreate）{
      for（key in oldDirs）{
        if（！newDirs [key]）{
          //不再存在，解除绑定
          callHook $ 1（oldDirs [key]，'unbind'，oldVnode，oldVnode，isDestroy）;
        }
      }
    }
  }

  var emptyModifiers = Object.create（null）;

  function normalizeDirectives $ 1（
    迪尔斯，
    VM
  ）{
    var res = Object.create（null）;
    if（！dirs）{
      // $ flow-disable-line
      返回资源
    }
    var i，dir;
    for（i = 0; i <dirs.length; i ++）{
      dir = dirs [i];
      if（！dir.modifiers）{
        // $ flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res [getRawDirName（dir）] = dir;
      dir.def = resolveAsset（vm。$ options，'directives'，dir.name，true）;
    }
    // $ flow-disable-line
    返回资源
  }

  function getRawDirName（dir）{
    return dir.rawName || （（dir.name）+“。”+（Object.keys（dir.modifiers || {}）。join（'。'）））
  }

  function callHook $ 1（dir，hook，vnode，oldVnode，isDestroy）{
    var fn = dir.def && dir.def [hook];
    if（fn）{
      尝试{
        fn（vnode.elm，dir，vnode，oldVnode，isDestroy）;
      } catch（e）{
        handleError（e，vnode.context，（“directive”+（dir.name）+“”+ hook +“hook”））;
      }
    }
  }

  var baseModules = [
    REF，
    指令
  ]。

  / * * /

  function updateAttrs（oldVnode，vnode）{
    var opts = vnode.componentOptions;
    if（isDef（opts）&& opts.Ctor.options.inheritAttrs === false）{
      返回
    }
    if（isUndef（oldVnode.data.attrs）&& isUndef（vnode.data.attrs））{
      返回
    }
    var key，cur，old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    //克隆观察对象，因为用户可能想要改变它
    if（isDef（attrs .__ ob __））{
      attrs = vnode.data.attrs = extend（{}，attrs）;
    }

    for（key in attrs）{
      cur = attrs [key];
      old = oldAttrs [key];
      if（old！== cur）{
        setAttr（elm，key，cur）;
      }
    }
    //＃4391：在IE9中，设置类型可以重置输入值[type = radio]
    //＃6666：IE / Edge在设置最大值之前强制进度值降至1
    / *伊斯坦布尔忽略如果* /
    if（（isIE || isEdge）&& attrs.value！== oldAttrs.value）{
      setAttr（elm，'value'，attrs.value）;
    }
    for（key in oldAttrs）{
      if（isUndef（attrs [key]））{
        if（isXlink（key））{
          elm.removeAttributeNS（xlinkNS，getXlinkProp（key））;
        } else if（！isEnumeratedAttr（key））{
          elm.removeAttribute（键）;
        }
      }
    }
  }

  function setAttr（el，key，value）{
    if（el.tagName.indexOf（' - '）> -1）{
      baseSetAttr（el，key，value）;
    } else if（isBooleanAttr（key））{
      //设置空值的属性
      //例如<禁用选项>选择一个</ option>
      if（isFalsyAttrValue（value））{
        el.removeAttribute（键）;
      } else {
        //技术上allowfullscreen是<iframe>的布尔属性，
        //但是当在<embed>标签上使用时，Flash期望值为“true”
        value = key ==='allowfullscreen'&& el.tagName ==='EMBED'
          ？'真正'
          ：关键;
        el.setAttribute（key，value）;
      }
    } else if（isEnumeratedAttr（key））{
      el.setAttribute（key，convertEnumeratedValue（key，value））;
    } else if（isXlink（key））{
      if（isFalsyAttrValue（value））{
        el.removeAttributeNS（xlinkNS，getXlinkProp（key））;
      } else {
        el.setAttributeNS（xlinkNS，key，value）;
      }
    } else {
      baseSetAttr（el，key，value）;
    }
  }

  function baseSetAttr（el，key，value）{
    if（isFalsyAttrValue（value））{
      el.removeAttribute（键）;
    } else {
      //＃7138：IE10和11在设置占位符时触发输入事件
      // <textarea> ...阻止第一个输入事件并删除阻止程序
      //立刻
      / *伊斯坦布尔忽略如果* /
      如果（
        isIE &&！isIE9 &&
        el.tagName ==='TEXTAREA'&&
        key ==='placeholder'&& value！==''&&！el .__ ieph
      ）{
        var blocker = function（e）{
          e.stopImmediatePropagation（）;
          el.removeEventListener（'input'，blocker）;
        };
        el.addEventListener（'input'，blocker）;
        // $ flow-disable-line
        el .__ ieph = true; / * IE占位符修补* /
      }
      el.setAttribute（key，value）;
    }
  }

  var attrs = {
    create：updateAttrs，
    更新：updateAttrs
  };

  / * * /

  function updateClass（oldVnode，vnode）{
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    如果（
      isUndef（data.staticClass）&&
      isUndef（data.class）&&（
        isUndef（oldData）|| （
          isUndef（oldData.staticClass）&&
          isUndef（oldData.class）
        ）
      ）
    ）{
      返回
    }

    var cls = genClassForVnode（vnode）;

    //处理过渡类
    var transitionClass = el._transitionClasses;
    if（isDef（transitionClass））{
      cls = concat（cls，stringifyClass（transitionClass））;
    }

    //设置班级
    if（cls！== el._prevClass）{
      el.setAttribute（'class'，cls）;
      el._prevClass = cls;
    }
  }

  var klass = {
    create：updateClass，
    更新：updateClass
  };

  / * * /

  var validDivisionCharRE = /[\w).+.-_$\]]/;

  function parseFilters（exp）{
    var inSingle = false;
    var inDouble = false;
    var inTemplateString = false;
    var inRegex = false;
    var curly = 0;
    var square = 0;
    var paren = 0;
    var lastFilterIndex = 0;
    var c，prev，i，expression，filters;

    for（i = 0; i <exp.length; i ++）{
      prev = c;
      c = exp.charCodeAt（i）;
      if（inSingle）{
        if（c === 0x27 && prev！== 0x5C）{inSingle = false; }
      } else if（inDouble）{
        if（c === 0x22 && prev！== 0x5C）{inDouble = false; }
      } else if（inTemplateString）{
        if（c === 0x60 && prev！== 0x5C）{inTemplateString = false; }
      } else if（inRegex）{
        if（c === 0x2f && prev！== 0x5C）{inRegex = false; }
      如果（
        c === 0x7C && // pipe
        exp.charCodeAt（i + 1）！== 0x7C &&
        exp.charCodeAt（i  -  1）！== 0x7C &&
        ！curly &&！square &&！paren
      ）{
        if（表达式=== undefined）{
          //第一个过滤器，结束表达式
          lastFilterIndex = i + 1;
          expression = exp.slice（0，i）.trim（）;
        } else {
          pushFilter（）;
        }
      } else {
        开关（c）{
          case 0x22：inDouble = true; 打破//“
          case 0x27：inSingle = true; 打破//'
          case 0x60：inTemplateString = true; 打破//`
          case 0x28：paren ++; 打破//（
          case 0x29：paren--; 打破//）
          case 0x5B：square ++; 打破// [
          case 0x5D：square--; 打破//]
          case 0x7B：卷曲++; 打破// {
          case 0x7D：curly--; 打破//}
        }
        if（c === 0x2f）{// /
          var j = i  -  1;
          var p =（void 0）;
          //找到第一个非空格的prev char
          for（; j> = 0; j--）{
            p = exp.charAt（j）;
            if（p！==''）{break}
          }
          if（！p ||！validDivisionCharRE.test（p））{
            inRegex = true;
          }
        }
      }
    }

    if（表达式=== undefined）{
      expression = exp.slice（0，i）.trim（）;
    } else if（lastFilterIndex！== 0）{
      pushFilter（）;
    }

    function pushFilter（）{
      （过滤器||（filters = []））。push（exp.slice（lastFilterIndex，i）.trim（））;
      lastFilterIndex = i + 1;
    }

    if（filters）{
      for（i = 0; i <filters.length; i ++）{
        expression = wrapFilter（expression，filters [i]）;
      }
    }

    返回表达式
  }

  function wrapFilter（exp，filter）{
    var i = filter.indexOf（'（'）;
    if（i <0）{
      // _f：resolveFilter
      return（“_ f（\”“+ filter +”\“）（”+ exp +“）”）
    } else {
      var name = filter.slice（0，i）;
      var args = filter.slice（i + 1）;
      return（“_ f（\”“+ name +”\“）（”+ exp +（args！=='）'？'，'+ args：args））
    }
  }

  / * * /



  / * eslint-disable no-unused-vars * /
  function baseWarn（msg，range）{
    console.error（（“[Vue编译器]：”+ msg））;
  }
  / * eslint-enable no-unused-vars * /

  function pluckModuleFunction（
    模块，
    键
  ）{
    返回模块
      ？modules.map（function（m）{return m [key];}）。filter（function（_）{return _;}）
      ：[]
  }

  function addProp（el，name，value，range，dynamic）{
    （el.props ||（el.props = []））。push（rangeSetItem（{name：name，value：value，dynamic：dynamic}，range））;
    el.plain = false;
  }

  function addAttr（el，name，value，range，dynamic）{
    var attrs =动态
      ？（el.dynamicAttrs ||（el.dynamicAttrs = []））
      ：（el.attrs ||（el.attrs = []））;
    attrs.push（rangeSetItem（{name：name，value：value，dynamic：dynamic}，range））;
    el.plain = false;
  }

  //添加一个原始attr（在preTransforms中使用它）
  function addRawAttr（el，name，value，range）{
    el.attrsMap [name] = value;
    el.attrsList.push（rangeSetItem（{name：name，value：value}，range））;
  }

  函数addDirective（
    埃尔，
    名称，
    rawName，
    值，
    ARG，
    isDynamicArg，
    改性剂，
    范围
  ）{
    （el.directives ||（el.directives = []））。push（rangeSetItem（{
      名称：名称，
      rawName：rawName，
      价值：价值，
      arg：arg，
      isDynamicArg：isDynamicArg，
      修饰符：修饰符
    }， 范围））;
    el.plain = false;
  }

  function prependModifierMarker（symbol，name，dynamic）{
    回归动态
      ？（“_ p（”+ name +“，”“”+ symbol +“\”）“）
      ：symbol + name //将事件标记为已捕获
  }

  function addHandler（
    埃尔，
    名称，
    值，
    改性剂，
    重要，
    警告，
    范围，
    动态
  ）{
    修饰符=修饰符|| emptyObject;
    //警告防止和被动修改器
    / *伊斯坦布尔忽略如果* /
    如果（
      警告&&
      modifiers.prevent && modifiers.passive
    ）{
      警告（
        '被动和防止不能一起使用。'+
        '被动处理程序无法阻止默认事件。'，
        范围
      ）;
    }

    //规范化click.right并click.middle，因为它们实际上并没有触发
    //这在技术上是浏览器特定的，但至少目前浏览器是
    //唯一具有右/中间点击次数的目标环境。
    if（modifiers.right）{
      if（动态）{
        name =“（”+ name +“）==='click'？'contextmenu':(”+ name +“）”;
      } else if（name ==='click'）{
        name ='contextmenu';
        delete modifiers.right;
      }
    } else if（modifiers.middle）{
      if（动态）{
        name =“（”+ name +“）==='click'？'mouseup':(”+ name +“）”;
      } else if（name ==='click'）{
        name ='mouseup';
      }
    }

    //检查捕获修改器
    if（modifiers.capture）{
      delete modifiers.capture;
      name = prependModifierMarker（'！'，name，dynamic）;
    }
    if（modifiers.once）{
      delete modifiers.once;
      name = prependModifierMarker（'〜'，name，dynamic）;
    }
    / *伊斯坦布尔忽略如果* /
    if（modifiers.passive）{
      delete modifiers.passive;
      name = prependModifierMarker（'＆'，name，dynamic）;
    }

    var事件;
    if（modifiers.native）{
      delete modifiers.native;
      events = el.nativeEvents || （el.nativeEvents = {}）;
    } else {
      events = el.events || （el.events = {}）;
    }

    var newHandler = rangeSetItem（{value：value.trim（），dynamic：dynamic}，range）;
    if（modifiers！== emptyObject）{
      newHandler.modifiers =修饰符;
    }

    var handlers = events [name];
    / *伊斯坦布尔忽略如果* /
    if（Array.isArray（handlers））{
      重要的？handlers.unshift（newHandler）：handlers.push（newHandler）;
    } else if（handlers）{
      事件[姓名] =重要吗？[newHandler，handlers]：[handlers，newHandler];
    } else {
      events [name] = newHandler;
    }

    el.plain = false;
  }

  function getRawBindingAttr（
    埃尔，
    名称
  ）{
    return el.rawAttrsMap ['：'+ name] ||
      el.rawAttrsMap ['v-bind：'+ name] ||
      el.rawAttrsMap [名]
  }

  function getBindingAttr（
    埃尔，
    名称，
    getStatic
  ）{
    var dynamicValue =
      getAndRemoveAttr（el，'：'+ name）||
      getAndRemoveAttr（el，'v-bind：'+ name）;
    if（dynamicValue！= null）{
      return parseFilters（dynamicValue）
    } else if（getStatic！== false）{
      var staticValue = getAndRemoveAttr（el，name）;
      if（staticValue！= null）{
        返回JSON.stringify（staticValue）
      }
    }
  }

  //注意：这只会从数组（attrsList）中删除attr以便它
  //不会被processAttrs处理。
  //默认情况下，它不会将其从地图中删除（attrsMap），因为地图是
  //在codegen期间需要。
  function getAndRemoveAttr（
    埃尔，
    名称，
    removeFromMap
  ）{
    var val;
    if（（val = el.attrsMap [name]）！= null）{
      var list = el.attrsList;
      for（var i = 0，l = list.length; i <l; i ++）{
        if（list [i] .name === name）{
          list.splice（i，1）;
          打破
        }
      }
    }
    if（removeFromMap）{
      删除el.attrsMap [name];
    }
    返回val
  }

  function getAndRemoveAttrByRegex（
    埃尔，
    名称
  ）{
    var list = el.attrsList;
    for（var i = 0，l = list.length; i <l; i ++）{
      var attr = list [i];
      if（name.test（attr.name））{
        list.splice（i，1）;
        返回attr
      }
    }
  }

  function rangeSetItem（
    项目，
    范围
  ）{
    if（range）{
      if（range.start！= null）{
        item.start = range.start;
      }
      if（range.end！= null）{
        item.end = range.end;
      }
    }
    归还物品
  }

  / * * /

  / **
   *组件v模型的跨平台代码生成
   * /
  function genComponentModel（
    埃尔，
    值，
    修饰符
  ）{
    var ref = modifiers || {};
    var number = ref.number;
    var trim = ref.trim;

    var baseValueExpression ='$$ v';
    var valueExpression = baseValueExpression;
    if（trim）{
      valueExpression =
        “（typeof”+ baseValueExpression +“==='string'”+
        “？”+ baseValueExpression +“。trim（）”+
        “：”+ baseValueExpression +“）”;
    }
    if（number）{
      valueExpression =“_ n（”+ valueExpression +“）”;
    }
    var assignment = genAssignmentCode（value，valueExpression）;

    el.model = {
      value：（“（”+ value +“）”），
      表达式：JSON.stringify（value），
      回调:(“function（”+ baseValueExpression +“）{”+ assignment +“}”）
    };
  }

  / **
   *跨平台的codegen助手，用于生成v-model值赋值代码。
   * /
  function genAssignmentCode（
    值，
    分配
  ）{
    var res = parseModel（value）;
    if（res.key === null）{
      return（值+“=”+赋值）
    } else {
      return（“$ set（”+（res.exp）+“，”+（res.key）+“，”+ assignment +“）”）
    }
  }

  / **
   *将v模型表达式解析为基本路径和最终关键段。
   *处理点路径和可能的方括号。
   *
   *可能的情况：
   *
   *  - 测试
   *  - 测试[关键]
   *  - 测试[test1 [key]]
   *  - 测试[“a”] [关键]
   *  -  xxx.test [a [a] .test1 [key]]
   *  -  test.xxx.a [“asa”] [test1 [key]]
   *
   * /

  var len，str，chr，index $ 1，expressionPos，expressionEndPos;



  function parseModel（val）{
    //修复https://github.com/vuejs/vue/pull/7730
    //允许v-model =“obj.val”（尾随空格）
    val = val.trim（）;
    len = val.length;

    if（val.indexOf（'['）<0 || val.lastIndexOf（']'）<len  -  1）{
      index $ 1 = val.lastIndexOf（'。'）;
      if（index $ 1> -1）{
        返回{
          exp：val.slice（0，index $ 1），
          key：'“'+ val.slice（index $ 1 + 1）+'”'
        }
      } else {
        返回{
          exp：val，
          key：null
        }
      }
    }

    str = val;
    index $ 1 = expressionPos = expressionEndPos = 0;

    while（！eof（））{
      chr = next（）;
      / *伊斯坦布尔忽略如果* /
      if（isStringStart（chr））{
        parseString（CHR）;
      } else if（chr === 0x5B）{
        parseBracket（CHR）;
      }
    }

    返回{
      exp：val.slice（0，expressionPos），
      key：val.slice（expressionPos + 1，expressionEndPos）
    }
  }

  function next（）{
    return str.charCodeAt（++ index $ 1）
  }

  function eof（）{
    返回索引$ 1> = len
  }

  function isStringStart（chr）{
    return chr === 0x22 || chr === 0x27
  }

  function parseBracket（chr）{
    var inBracket = 1;
    expressionPos = index $ 1;
    while（！eof（））{
      chr = next（）;
      if（isStringStart（chr））{
        parseString（CHR）;
        继续
      }
      if（chr === 0x5B）{inBracket ++; }
      if（chr === 0x5D）{inBracket--; }
      if（inBracket === 0）{
        expressionEndPos = index $ 1;
        打破
      }
    }
  }

  function parseString（chr）{
    var stringQuote = chr;
    while（！eof（））{
      chr = next（）;
      if（chr === stringQuote）{
        打破
      }
    }
  }

  / * * /

  var警告1美元;

  //在某些情况下，必须在运行时确定使用的事件
  //所以我们在编译期间使用了一些保留的标记。
  var RANGE_TOKEN ='__ r';
  var CHECKBOX_RADIO_TOKEN ='__ c';

  功能模型（
    埃尔，
    DIR，
    _警告
  ）{
    警告$ 1 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;

    {
      //带有type =“file”的输入是只读的并设置输入
      //值将引发错误。
      if（tag ==='input'&& type ==='file'）{
        警告$ 1（
          “<”+（el.tag）+“v-model = \”“+ value +”\“type = \”file \“>：\ n”+
          “文件输入是只读的。使用v-on：改变监听器。”，
          el.rawAttrsMap [ 'V模型']
        ）;
      }
    }

    if（el.component）{
      genComponentModel（el，value，modifiers）;
      //组件v-model不需要额外的运行时
      返回false
    } else if（tag ==='select'）{
      genSelect（el，value，modifiers）;
    } else if（tag ==='input'&& type ==='checkbox'）{
      genCheckboxModel（el，value，modifiers）;
    } else if（tag ==='input'&& type ==='radio'）{
      genRadioModel（el，value，modifiers）;
    } else if（tag ==='input'|| tag ==='textarea'）{
      genDefaultModel（el，value，modifiers）;
    } else if（！config.isReservedTag（tag））{
      genComponentModel（el，value，modifiers）;
      //组件v-model不需要额外的运行时
      返回false
    } else {
      警告$ 1（
        “<”+（el.tag）+“v-model = \”“+ value +”\“>：”+
        “此元素类型不支持v-model。”+
        '如果你正在努力工作，那么建议'+
        '在自定义组件中包装专门用于此目的的库。'，
        el.rawAttrsMap [ 'V模型']
      ）;
    }

    //确保运行时指令元数据
    返回true
  }

  function genCheckboxModel（
    埃尔，
    值，
    修饰符
  ）{
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr（el，'value'）|| '空值';
    var trueValueBinding = getBindingAttr（el，'true-value'）|| '真正';
    var falseValueBinding = getBindingAttr（el，'false-value'）|| '假';
    addProp（el，'checked'，
      “Array.isArray（”+ value +“）”+
      “？_i（”+ value +“，”+ valueBinding +“）>  -  1”+（
        trueValueBinding ==='true'
          ？（“:(”+ value +“）”）
          ：（“：_q（”+ value +“，”+ trueValueBinding +“）”）
      ）
    ）;
    addHandler（el，'change'，
      “var $$ a =”+ value +“，”+
          '$$ el = $ event.target，'+
          “$$ c = $$ el.checked？（”+ trueValueBinding +“）:(”+ falseValueBinding +“）;” +
      'if（Array.isArray（$$ a））{'+
        “var $$ v =”+（number？'_ n（'+ valueBinding +'）'：valueBinding）+“，”+
            '$$ I = _i（$$ A，$$ V）;' +
        “if（$$ el.checked）{$$ i <0 &&（”+（genAssignmentCode（value，'$$ a.concat（[$$ v]）'））+“）}”+
        “else {$$ i> -1 &&（”+（genAssignmentCode（value，'$$ a.slice（0，$$ i）.concat（$$ a.slice（$$ i + 1））'））+ “）}”+
      “} else {”+（genAssignmentCode（value，'$$ c'））+“}”，
      null，true
    ）;
  }

  function genRadioModel（
    埃尔，
    值，
    修饰符
  ）{
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr（el，'value'）|| '空值';
    valueBinding = number？（“_ n（”+ valueBinding +“）”）：valueBinding;
    addProp（el，'checked'，（“_ q（”+ value +“，”+ valueBinding +“）”））;
    addHandler（el，'change'，genAssignmentCode（value，valueBinding），null，true）;
  }

  功能genSelect（
    埃尔，
    值，
    修饰符
  ）{
    var number = modifiers && modifiers.number;
    var selectedVal =“Array.prototype.filter”+
      “.call（$ event.target.options，function（o）{return o.selected}）”+
      “.map（函数（o）{var val = \”_ value \“in o？o._value：o.value;”+
      “return”+（number？'_ n（val）'：'val'）+“}）”;

    var assignment ='$ event.target.multiple？$$ selectedVal：$$ selectedVal [0]';
    var code =“var $$ selectedVal =”+ selectedVal +“;”;
    code = code +“”+（genAssignmentCode（value，assignment））;
    addHandler（el，'change'，code，null，true）;
  }

  function genDefaultModel（
    埃尔，
    值，
    修饰符
  ）{
    var type = el.attrsMap.type;

    //警告v-bind：值是否与v-model冲突
    //除了带有v-bind的输入：type
    {
      var value $ 1 = el.attrsMap ['v-bind：value'] || el.attrsMap [ '：值'];
      var typeBinding = el.attrsMap ['v-bind：type'] || el.attrsMap [ '：类型'];
      if（value $ 1 &&！typeBinding）{
        var binding = el.attrsMap ['v-bind：value']？'v-bind：value'：'：value';
        警告$ 1（
          binding +“= \”“+ value $ 1 +”\“与同一元素上的v-model冲突”+
          '因为后者已经扩展到内部绑定价值'，
          el.rawAttrsMap [结合]
        ）;
      }
    }

    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard =！lazy && type！=='range';
    var event = lazy
      ？'更改'
      ：type ==='range'
        ？RANGE_TOKEN
        ：'输入';

    var valueExpression ='$ event.target.value';
    if（trim）{
      valueExpression =“$ event.target.value.trim（）”;
    }
    if（number）{
      valueExpression =“_ n（”+ valueExpression +“）”;
    }

    var code = genAssignmentCode（value，valueExpression）;
    if（needCompositionGuard）{
      code =“if（$ event.target.composing）return;” +代码;
    }

    addProp（el，'value'，（“（”+ value +“）”））;
    addHandler（el，event，code，null，true）;
    if（trim || number）{
      addHandler（el，'blur'，'$ forceUpdate（）'）;
    }
  }

  / * * /

  //规范化只能在运行时确定的v-model事件令牌。
  //将事件放在数组中的第一个是很重要的因为
  //重点是确保之前调用v-model回调
  //用户附加的处理程序。
  function normalizeEvents（on）{
    / *伊斯坦布尔忽略如果* /
    if（isDef（在[RANGE_TOKEN]上））{
      // IE输入[type = range]仅支持`change`事件
      var event = isIE？'改变'：'输入';
      on [event] = [] .concat（在[RANGE_TOKEN]上，在[event] || []）;
      删除[RANGE_TOKEN];
    }
    //这最初是为了修复＃4521但不再需要
    // 2.5之后 保持它向后兼容<2.4的生成代码
    / *伊斯坦布尔忽略如果* /
    if（isDef（on [CHECKBOX_RADIO_TOKEN]））{
      on.change = [] .concat（on [CHECKBOX_RADIO_TOKEN]，on.change || []）;
      删除[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target $ 1;

  function createOnceHandler $ 1（event，handler，capture）{
    var _target = target $ 1; //将当前目标元素保存在闭包中
    return函数onceHandler（）{
      var res = handler.apply（null，arguments）;
      if（res！== null）{
        删除$ 2（event，onceHandler，capture，_target）;
      }
    }
  }

  //＃9446：Firefox <= 53（特别是ESR 52）的Event.timeStamp不正确
  //实现并且不会在事件传播之间触发微任务，所以
  //安全排除
  var useMicrotaskFix = isUsingMicroTask &&！（isFF && Number（isFF [1]）<= 53）;

  功能添加$ 1（
    名称，
    处理程序，
    捕获，
    被动
  ）{
    //异步边缘情况＃6566：内部点击事件触发补丁，事件处理程序
    //在补丁期间附加到外部元素，并再次触发。这个
    //因为浏览器在事件传播之间触发微任务标记。
    //解决方案很简单：我们在附加处理程序时保存时间戳，
    //并且只有在传递给它的事件被触发时才会触发处理程序
    //附上之后
    if（useMicrotaskFix）{
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function（e）{
        如果（
          //没有冒泡，应该总是开火。
          //这只是一个安全网，如果event.timeStamp不可靠
          //某些奇怪的环境......
          e.target === e.currentTarget ||
          //在处理程序附件后触发事件
          e.timeStamp> = attachedTimestamp ||
          //为有错误的event.timeStamp实现的环境保释
          //＃9462 iOS 9 bug：history.timeStamp在history.pushState之后为0
          //＃9681 QtWebEngine event.timeStamp为负值
          e.timeStamp <= 0 ||
          //如果在多页中的另一个文档中触发事件，则＃9448保释
          // electron / nw.js app，因为event.timeStamp将使用不同的
          //开始参考
          e.target.ownerDocument！==文件
        ）{
          return original.apply（this，arguments）
        }
      };
    }
    目标$ 1.addEventListener（
      名称，
      处理程序，
      supportsPassive
        ？{capture：capture，passive：passive}
        ：捕获
    ）;
  }

  功能删除$ 2（
    名称，
    处理程序，
    捕获，
    _目标
  ）{
    （_target || target $ 1）.removeEventListener（
      名称，
      handler._wrapper || 处理程序，
      捕获
    ）;
  }

  function updateDOMListeners（oldVnode，vnode）{
    if（isUndef（oldVnode.data.on）&& isUndef（vnode.data.on））{
      返回
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target $ 1 = vnode.elm;
    normalizeEvents（上）;
    updateListeners（on，oldOn，add $ 1，remove $ 2，createOnceHandler $ 1，vnode.context）;
    目标$ 1 =未定义;
  }

  var events = {
    create：updateDOMListeners，
    更新：updateDOMListeners
  };

  / * * /

  var svgContainer;

  function updateDOMProps（oldVnode，vnode）{
    if（isUndef（oldVnode.data.domProps）&& isUndef（vnode.data.domProps））{
      返回
    }
    var key，cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    //克隆观察对象，因为用户可能想要改变它
    if（isDef（props .__ ob __））{
      props = vnode.data.domProps = extend（{}，props）;
    }

    for（key in oldProps）{
      if（！（key in props））{
        elm [key] ='';
      }
    }

    for（key in props）{
      cur = props [key];
      //如果节点有textContent或innerHTML，则忽略子节点
      //因为这些会丢弃现有的DOM节点并导致删除错误
      //在随后的补丁上（＃3360）
      if（key ==='textContent'|| key ==='innerHTML'）{
        if（vnode.children）{vnode.children.length = 0; }
        if（cur === oldProps [key]）{continue}
        //＃6601解决Chrome版本<= 55 bug的问题，单个textNode
        //由innerHTML替换/ textContent保留其parentNode属性
        if（elm.childNodes.length === 1）{
          elm.removeChild（elm.childNodes [0]）;
        }
      }

      if（key ==='value'&& elm.tagName！=='PROGRESS'）{
        //将值存储为_value以及
        //非字符串值将被字符串化
        elm._value = cur;
        //当值相同时，避免重置光标位置
        var strCur = isUndef（cur）？''：String（cur）;
        if（shouldUpdateValue（elm，strCur））{
          elm.value = strCur;
        }
      } else if（key ==='innerHTML'&& isSVG（elm.tagName）&& isUndef（elm.innerHTML））{
        // IE不支持SVG元素的innerHTML
        svgContainer = svgContainer || 使用document.createElement（ 'DIV'）;
        svgContainer.innerHTML =“<svg>”+ cur +“</ svg>”;
        var svg = svgContainer.firstChild;
        while（elm.firstChild）{
          elm.removeChild（elm.firstChild）;
        }
        while（svg.firstChild）{
          elm.appendChild（svg.firstChild）;
        }
      如果（
        //如果旧的和新的VDOM状态相同，则跳过更新。
        //`value`是单独处理的，因为DOM值可能是暂时的
        //由于焦点，合成和修饰符而与VDOM状态不同步。
        //跳过不必要的`checked`更新＃4521。
        cur！== oldProps [关键]
      ）{
        //一些属性更新可以抛出
        //例如，<progress>上的`value` w /非有限值
        尝试{
          榆树[key] = cur;
        } catch（e）{}
      }
    }
  }

  //检查platforms / web / util / attrs.js acceptValue


  function shouldUpdateValue（elm，checkVal）{
    return（！elm.composing &&（
      elm.tagName ==='OPTION'||
      isNotInFocusAndDirty（elm，checkVal）||
      isDirtyWithModifiers（elm，checkVal）
    ））
  }

  function isNotInFocusAndDirty（elm，checkVal）{
    //当文本框（.number和.trim）失去焦点并且其值为时，返回true
    //不等于更新的值
    var notInFocus = true;
    //＃6157
    //在iframe中访问document.activeElement时，可以解决IE漏洞问题
    试试{notInFocus = document.activeElement！== elm; } catch（e）{}
    return notInFocus && elm.value！== checkVal
  }

  function isDirtyWithModifiers（elm，newVal）{
    var value = elm.value;
    var modifiers = elm._vModifiers; //由v-model运行时注入
    if（isDef（modifiers））{
      if（modifiers.number）{
        return toNumber（value）！== toNumber（newVal）
      }
      if（modifiers.trim）{
        return value.trim（）！== newVal.trim（）
      }
    }
    返回值！== newVal
  }

  var domProps = {
    create：updateDOMProps，
    更新：updateDOMProps
  };

  / * * /

  var parseStyleText = cached（function（cssText）{
    var res = {};
    var listDelimiter = /;（？！[^（] * \））/ g;
    var propertyDelimiter = /:(.+)/;
    cssText.split（listDelimiter）.forEach（function（item）{
      if（item）{
        var tmp = item.split（propertyDelimiter）;
        tmp.length> 1 &&（res [tmp [0] .trim（）] = tmp [1] .trim（））;
      }
    }）;
    返回资源
  }）;

  //在同一个vnode上合并静态和动态样式数据
  function normalizeStyleData（data）{
    var style = normalizeStyleBinding（data.style）;
    //静态样式在编译期间被预处理为对象
    //并且始终是一个新鲜的对象，因此合并到它中是安全的
    return data.staticStyle
      ？extend（data.staticStyle，style）
      ：风格
  }

  //将可能的数组/字符串值规范化为Object
  function normalizeStyleBinding（bindingStyle）{
    if（Array.isArray（bindingStyle））{
      return toObject（bindingStyle）
    }
    if（typeof bindingStyle ==='string'）{
      return parseStyleText（bindingStyle）
    }
    return bindingStyle
  }

  / **
   *父组件样式应该在孩子之后
   *以便父组件的样式可以覆盖它
   * /
  function getStyle（vnode，checkChild）{
    var res = {};
    var styleData;

    if（checkChild）{
      var childNode = vnode;
      while（childNode.componentInstance）{
        childNode = childNode.componentInstance._vnode;
        如果（
          childNode && childNode.data &&
          （styleData = normalizeStyleData（childNode.data））
        ）{
          extend（res，styleData）;
        }
      }
    }

    if（（styleData = normalizeStyleData（vnode.data）））{
      extend（res，styleData）;
    }

    var parentNode = vnode;
    while（（parentNode = parentNode.parent））{
      if（parentNode.data &&（styleData = normalizeStyleData（parentNode.data）））{
        extend（res，styleData）;
      }
    }
    返回资源
  }

  / * * /

  var cssVarRE = / ^  -  /;
  var importantRE = / \ s *！important $ /;
  var setProp = function（el，name，val）{
    / *伊斯坦布尔忽略如果* /
    if（cssVarRE.test（name））{
      el.style.setProperty（name，val）;
    } else if（importantRE.test（val））{
      el.style.setProperty（连字符（name），val.replace（importantRE，''），'important'）;
    } else {
      var normalizedName = normalize（name）;
      if（Array.isArray（val））{
        //支持autoprefixer创建的值数组，例如
        // {display：[“ -  webkit-box”，“ -  ms-flexbox”，“flex”]}
        //逐个设置它们，浏览器只会设置它能识别的那些
        for（var i = 0，len = val.length; i <len; i ++）{
          el.style [normalizedName] = val [i];
        }
      } else {
        el.style [normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit'，'Moz'，'ms'];

  var emptyStyle;
  var normalize = cached（function（prop）{
    emptyStyle = emptyStyle || 。使用document.createElement（ 'DIV'）风格;
    prop = camelize（prop）;
    if（prop！=='filter'&&（propStyle中的prop））{
      返回道具
    }
    var capName = prop.charAt（0）.toUpperCase（）+ prop.slice（1）;
    for（var i = 0; i <vendorNames.length; i ++）{
      var name = vendorNames [i] + capName;
      if（name in emptyStyle）{
        返回名称
      }
    }
  }）;

  function updateStyle（oldVnode，vnode）{
    var data = vnode.data;
    var oldData = oldVnode.data;

    if（isUndef（data.staticStyle）&& isUndef（data.style）&&
      isUndef（oldData.staticStyle）&& isUndef（oldData.style）
    ）{
      返回
    }

    var cur，name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    //如果存在静态样式，则在执行normalizeStyleData时，stylebinding已合并到其中
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding（vnode.data.style）|| {};

    //将标准化样式存储在下一个差异的不同键下
    //确保克隆它，如果它是被动的，因为用户可能想要
    //改变它
    vnode.data.normalizedStyle = isDef（style .__ ob__）
      ？extend（{}，style）
      ：风格;

    var newStyle = getStyle（vnode，true）;

    for（oldStyle中的名称）{
      if（isUndef（newStyle [name]））{
        setProp（el，name，''）;
      }
    }
    for（newStyle中的名字）{
      cur = newStyle [name];
      if（cur！== oldStyle [name]）{
        // ie9设置为null无效，必须使用空字符串
        setProp（el，name，cur == null？''：cur）;
      }
    }
  }

  var style = {
    create：updateStyle，
    更新：updateStyle
  };

  / * * /

  var whitespaceRE = / \ s + /;

  / **
   *添加具有SVG兼容性的类，因为不支持classList
   * IE中的SVG元素
   * /
  function addClass（el，cls）{
    / *伊斯坦布尔忽略如果* /
    if（！cls ||！（cls = cls.trim（）））{
      返回
    }

    / * istanbul忽略其他* /
    if（el.classList）{
      if（cls.indexOf（''）> -1）{
        cls.split（whitespaceRE）.forEach（function（c）{return el.classList.add（c）;}）;
      } else {
        el.classList.add（CLS）;
      }
    } else {
      var cur =“”+（el.getAttribute（'class'）||''）+“”;
      if（cur.indexOf（''+ cls +''）<0）{
        el.setAttribute（'class'，（cur + cls）.trim（））;
      }
    }
  }

  / **
   *删除具有SVG兼容性的类，因为不支持classList
   * IE中的SVG元素
   * /
  function removeClass（el，cls）{
    / *伊斯坦布尔忽略如果* /
    if（！cls ||！（cls = cls.trim（）））{
      返回
    }

    / * istanbul忽略其他* /
    if（el.classList）{
      if（cls.indexOf（''）> -1）{
        cls.split（whitespaceRE）.forEach（function（c）{return el.classList.remove（c）;}）;
      } else {
        el.classList.remove（CLS）;
      }
      if（！el.classList.length）{
        el.removeAttribute（ '类'）;
      }
    } else {
      var cur =“”+（el.getAttribute（'class'）||''）+“”;
      var tar =''+ cls +'';
      while（cur.indexOf（tar）> = 0）{
        cur = cur.replace（tar，''）;
      }
      cur = cur.trim（）;
      if（cur）{
        el.setAttribute（'class'，cur）;
      } else {
        el.removeAttribute（ '类'）;
      }
    }
  }

  / * * /

  function resolveTransition（def $$ 1）{
    if（！def $$ 1）{
      返回
    }
    / * istanbul忽略其他* /
    if（typeof def $$ 1 ==='object'）{
      var res = {};
      if（def $$ 1.css！== false）{
        extend（res，autoCssTransition（def $$ 1.name ||'v'））;
      }
      extend（res，def $$ 1）;
      返回资源
    } else if（typeof def $$ 1 ==='string'）{
      return autoCssTransition（def $$ 1）
    }
  }

  var autoCssTransition = cached（function（name）{
    返回{
      enterClass :( name +“-enter”），
      enterToClass :( name +“-enter-to”），
      enterActiveClass :( name +“-enter-active”），
      leaveClass :( name +“-leave”），
      leaveToClass :( name +“-leave-to”），
      leaveActiveClass :( name +“-leave-active”）
    }
  }）;

  var hasTransition = inBrowser &&！isIE9;
  var TRANSITION ='transition';
  var ANIMATION ='animation';

  //过渡属性/事件嗅探
  var transitionProp ='transition';
  var transitionEndEvent ='transitionend';
  var animationProp ='animation';
  var animationEndEvent ='animationend';
  if（hasTransition）{
    / *伊斯坦布尔忽略如果* /
    if（window.ontransitionend === undefined &&
      window.onwebkittransitionend！== undefined
    ）{
      transitionProp ='WebkitTransition';
      transitionEndEvent ='webkitTransitionEnd';
    }
    if（window.onanimationend === undefined &&
      window.onwebkitanimationend！== undefined
    ）{
      animationProp ='WebkitAnimation';
      animationEndEvent ='webkitAnimationEnd';
    }
  }

  //绑定到窗口是必要的，以便在严格模式下在IE中进行热重新加载
  var raf = inBrowser
    ？window.requestAnimationFrame
      ？window.requestAnimationFrame.bind（窗口）
      ：setTimeout
    ：/ * istanbul ignore next * / function（fn）{return fn（）; };

  function nextFrame（fn）{
    raf（function（）{
      RAF（FN）;
    }）;
  }

  function addTransitionClass（el，cls）{
    var transitionClasses = el._transitionClasses || （el._transitionClasses = []）;
    if（transitionClasses.indexOf（cls）<0）{
      transitionClasses.push（CLS）;
      addClass（el，cls）;
    }
  }

  function removeTransitionClass（el，cls）{
    if（el._transitionClasses）{
      remove（el._transitionClasses，cls）;
    }
    removeClass（el，cls）;
  }

  功能whenTransitionEnds（
    埃尔，
    expectedType，
    CB
  ）{
    var ref = getTransitionInfo（el，expectedType）;
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if（！type）{return cb（）}
    var event = type === TRANSITION？transitionEndEvent：animationEndEvent;
    var ends = 0;
    var end = function（）{
      el.removeEventListener（event，onEnd）;
      CB（）;
    };
    var onEnd = function（e）{
      if（e.target === el）{
        if（++ ends> = propCount）{
          结束（）;
        }
      }
    };
    setTimeout（function（）{
      if（已结束<propCount）{
        结束（）;
      }
    }，超时+ 1）;
    el.addEventListener（event，onEnd）;
  }

  var transformRE = / \ b（transform | all）（，| $）/;

  function getTransitionInfo（el，expectedType）{
    var styles = window.getComputedStyle（el）;
    // JSDOM可能会为转换属性返回undefined
    var transitionDelays =（styles [transitionProp +'Delay'] ||''）。split（'，'）;
    var transitionDurations =（styles [transitionProp +'Duration'] ||''）。split（'，'）;
    var transitionTimeout = getTimeout（transitionDelays，transitionDurations）;
    var animationDelays =（styles [animationProp +'Delay'] ||''）。split（'，'）;
    var animationDurations =（styles [animationProp +'Duration'] ||''）。split（'，'）;
    var animationTimeout = getTimeout（animationDelays，animationDurations）;

    var类型;
    var timeout = 0;
    var propCount = 0;
    / *伊斯坦布尔忽略如果* /
    if（expectedType === TRANSITION）{
      if（transitionTimeout> 0）{
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if（expectedType === ANIMATION）{
      if（animationTimeout> 0）{
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max（transitionTimeout，animationTimeout）;
      type = timeout> 0
        ？transitionTimeout> animationTimeout
          ？过渡
          ： 动画
        ： 空值;
      propCount =类型
        ？type === TRANSITION
          ？transitionDurations.length
          ：animationDurations.length
        ：0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test（styles [transitionProp +'Property']）;
    返回{
      类型：类型，
      超时：超时，
      propCount：propCount，
      hasTransform：hasTransform
    }
  }

  function getTimeout（延迟，持续时间）{
    / * istanbul忽略下一个* /
    while（delays.length <durations.length）{
      延迟=延迟.concat（延迟）;
    }

    返回Math.max.apply（null，durations.map（function（d，i）{
      返回到Ms（d）+ toMs（延迟[i]）
    }））
  }

  //旧版本的Chromium（低于61.0.3163.100）格式化浮动指针编号
  //以区域设置相关的方式，使用逗号而不是点。
  //如果逗号未被点替换，则输入将向下舍入（即表演
  //作为楼层功能）导致意外行为
  function toMs（s）{
    返回Number（s.slice（0，-1）.replace（'，'，'。'））* 1000
  }

  / * * /

  function enter（vnode，toggleDisplay）{
    var el = vnode.elm;

    //现在打电话给回电话
    if（isDef（el._leaveCb））{
      el._leaveCb.cancelled = true;
      el._leaveCb（）;
    }

    var data = resolveTransition（vnode.data.transition）;
    if（isUndef（data））{
      返回
    }

    / *伊斯坦布尔忽略如果* /
    if（isDef（el._enterCb）|| el.nodeType！== 1）{
      返回
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance将始终是管理它的<transition>组件
    // 过渡。要检查的一个边缘情况是放置<transition>的时间
    //作为子组件的根节点。在那种情况下，我们需要检查
    // <transition>的父级用于显示检查。
    var context = activeInstance;
    var transitionNode = activeInstance。$ vnode;
    while（transitionNode && transitionNode.parent）{
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear =！context._isMounted || ！vnode.isRootInsert;

    if（isAppear &&！出现&&出现！==''）{
      返回
    }

    var startClass = isAppear && appearClass
      ？appearClass
      ：enterClass;
    var activeClass = isAppear && appearActiveClass
      ？appearActiveClass
      ：enterActiveClass;
    var toClass = isAppear && appearToClass
      ？appearToClass
      ：enterToClass;

    var beforeEnterHook = isAppear
      ？（beforeAppear || beforeEnter）
      ：beforeEnter;
    var enterHook = isAppear
      ？（typeof出现==='功能'？出现：输入）
      ：输入;
    var afterEnterHook = isAppear
      ？（afterAppear || afterEnter）
      ：afterEnter;
    var enterCancelledHook = isAppear
      ？（appearCancelled || enterCancelled）
      ：enterCancelled;

    var explicitEnterDuration = toNumber（
      则IsObject（持续时间）
        ？duration.enter
        ：持续时间
    ）;

    if（explicitEnterDuration！= null）{
      checkDuration（explicitEnterDuration，'enter'，vnode）;
    }

    var expectCSS = css！== false &&！isIE9;
    var userWantsControl = getHookArgumentsLength（enterHook）;

    var cb = el._enterCb = once（function（）{
      if（expectedCSS）{
        removeTransitionClass（el，toClass）;
        removeTransitionClass（el，activeClass）;
      }
      if（cb.cancelled）{
        if（expectedCSS）{
          removeTransitionClass（el，startClass）;
        }
        enterCancelledHook && enterCancelledHook（el）;
      } else {
        afterEnterHook && afterEnterHook（el）;
      }
      el._enterCb = null;
    }）;

    if（！vnode.data.show）{
      //通过注入插入钩子来删除输入中的挂起的leave元素
      mergeVNodeHook（vnode，'insert'，function（）{
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending [vnode.key];
        if（pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ）{
          pendingNode.elm._leaveCb（）;
        }
        enterHook && enterHook（el，cb）;
      }）;
    }

    //开始输入转换
    beforeEnterHook && beforeEnterHook（el）;
    if（expectedCSS）{
      addTransitionClass（el，startClass）;
      addTransitionClass（el，activeClass）;
      nextFrame（function（）{
        removeTransitionClass（el，startClass）;
        if（！cb.cancelled）{
          addTransitionClass（el，toClass）;
          if（！userWantsControl）{
            if（isValidDuration（explicitEnterDuration））{
              setTimeout（cb，explicitEnterDuration）;
            } else {
              whenTransitionEnds（el，type，cb）;
            }
          }
        }
      }）;
    }

    if（vnode.data.show）{
      toggleDisplay && toggleDisplay（）;
      enterHook && enterHook（el，cb）;
    }

    if（！expectedCSS &&！userWantsControl）{
      CB（）;
    }
  }

  function leave（vnode，rm）{
    var el = vnode.elm;

    //现在调用回调回调
    if（isDef（el._enterCb））{
      el._enterCb.cancelled = true;
      el._enterCb（）;
    }

    var data = resolveTransition（vnode.data.transition）;
    if（isUndef（data）|| el.nodeType！== 1）{
      return rm（）
    }

    / *伊斯坦布尔忽略如果* /
    if（isDef（el._leaveCb））{
      返回
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectCSS = css！== false &&！isIE9;
    var userWantsControl = getHookArgumentsLength（leave）;

    var explicitLeaveDuration = toNumber（
      则IsObject（持续时间）
        ？duration.leave
        ：持续时间
    ）;

    if（isDef（explicitLeaveDuration））{
      checkDuration（explicitLeaveDuration，'leave'，vnode）;
    }

    var cb = el._leaveCb = once（function（）{
      if（el.parentNode && el.parentNode._pending）{
        el.parentNode._pending [vnode.key] = null;
      }
      if（expectedCSS）{
        removeTransitionClass（el，leaveToClass）;
        removeTransitionClass（el，leaveActiveClass）;
      }
      if（cb.cancelled）{
        if（expectedCSS）{
          removeTransitionClass（el，leaveClass）;
        }
        leaveCancelled && leaveCancelled（el）;
      } else {
        R M（）;
        afterLeave && afterLeave（el）;
      }
      el._leaveCb = null;
    }）;

    if（delayLeave）{
      delayLeave（performLeave）;
    } else {
      performLeave（）;
    }

    function performLeave（）{
      //延迟假期可能已被取消
      if（cb.cancelled）{
        返回
      }
      //记录离开元素
      if（！vnode.data.show && el.parentNode）{
        （el.parentNode._pending ||（el.parentNode._pending = {}））[（vnode.key）] = vnode;
      }
      beforeLeave && beforeLeave（el）;
      if（expectedCSS）{
        addTransitionClass（el，leaveClass）;
        addTransitionClass（el，leaveActiveClass）;
        nextFrame（function（）{
          removeTransitionClass（el，leaveClass）;
          if（！cb.cancelled）{
            addTransitionClass（el，leaveToClass）;
            if（！userWantsControl）{
              if（isValidDuration（explicitLeaveDuration））{
                setTimeout（cb，explicitLeaveDuration）;
              } else {
                whenTransitionEnds（el，type，cb）;
              }
            }
          }
        }）;
      }
      离开&&离开（el，cb）;
      if（！expectedCSS &&！userWantsControl）{
        CB（）;
      }
    }
  }

  //仅在开发模式下使用
  function checkDuration（val，name，vnode）{
    if（typeof val！=='number'）{
      警告（
        “<transition> explicit”+ name +“duration不是有效数字 - ”+
        “得到”+（JSON.stringify（val））+“。”，
        vnode.context
      ）;
    } else if（isNaN（val））{
      警告（
        “<transition> explicit”+ name +“duration is NaN  - ”+
        '持续时间表达可能不正确。'，
        vnode.context
      ）;
    }
  }

  function isValidDuration（val）{
    return typeof val ==='number'&&！isNaN（val）
  }

  / **
   *规范化转换钩子的参数长度。钩子可能是：
   *  - 与.fns中的原始合并的钩子（调用者）
   *  - 包装组件方法（检查._length）
   *  - 普通函数（.length）
   * /
  function getHookArgumentsLength（fn）{
    if（isUndef（fn））{
      返回false
    }
    var invokerFns = fn.fns;
    if（isDef（invokerFns））{
      //调用者
      return getHookArgumentsLength（
        Array.isArray（invokerFns）
          ？invokerFns [0]
          ：invokerFns
      ）
    } else {
      return（fn._length || fn.length）> 1
    }
  }

  function _enter（_，vnode）{
    if（vnode.data.show！== true）{
      输入（v节点）;
    }
  }

  var transition = inBrowser？{
    创建：_enter，
    激活：_enter，
    remove：function remove $$ 1（vnode，rm）{
      / * istanbul忽略其他* /
      if（vnode.data.show！== true）{
        离开（vnode，rm）;
      } else {
        R M（）;
      }
    }
  }：{};

  var platformModules = [
    ATTRS，
    克拉斯，
    事件，
    domProps，
    样式，
    过渡
  ]。

  / * * /

  //毕竟应该最后应用指令模块
  //已应用内置模块。
  var modules = platformModules.concat（baseModules）;

  var patch = createPatchFunction（{nodeOps：nodeOps，modules：modules}）;

  / **
   *不输入检查此文件，因为流不喜欢附加
   * Elements的属性。
   * /

  / *伊斯坦布尔忽略如果* /
  if（isIE9）{
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener（'selectionchange'，function（）{
      var el = document.activeElement;
      if（el && el.vmodel）{
        触发器（el，'input'）;
      }
    }）;
  }

  var directive = {
    inserted：插入函数（el，binding，vnode，oldVnode）{
      if（vnode.tag ==='select'）{
        //＃6903
        if（oldVnode.elm &&！oldVnode.elm._vOptions）{
          mergeVNodeHook（vnode，'postpatch'，function（）{
            directive.componentUpdated（el，binding，vnode）;
          }）;
        } else {
          setSelected（el，binding，vnode.context）;
        }
        el._vOptions = []。map.call（el.options，getValue）;
      } else if（vnode.tag ==='textarea'|| isTextInputType（el.type））{
        el._vModifiers = binding.modifiers;
        if（！binding.modifiers.lazy）{
          el.addEventListener（'compositionstart'，onCompositionStart）;
          el.addEventListener（'compositionend'，onCompositionEnd）;
          // Safari <10.2＆UIWebView何时不会触发compositionend
          //在确认构图选择之前切换焦点
          //这也解决了某些浏览器的问题，例如iOS Chrome
          //在自动完成时触发“更改”而不是“输入”。
          el.addEventListener（'change'，onCompositionEnd）;
          / *伊斯坦布尔忽略如果* /
          if（isIE9）{
            el.vmodel = true;
          }
        }
      }
    }，

    componentUpdated：function componentUpdated（el，binding，vnode）{
      if（vnode.tag ==='select'）{
        setSelected（el，binding，vnode.context）;
        //如果v-for呈现的选项已更改，
        //该值可能与渲染的选项不同步。
        //检测此类情况并过滤掉不再匹配的值
        // DOM中的选项。
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = []。map.call（el.options，getValue）;
        if（curOptions.some（function（o，i）{return！looseEqual（o，prevOptions [i]）;}））{
          //触发更改事件if
          //找不到至少一个值的匹配选项
          var needReset = el.multiple
            ？binding.value.some（function（v）{return hasNoMatchingOption（v，curOptions）;}）
            ：binding.value！== binding.oldValue && hasNoMatchingOption（binding.value，curOptions）;
          if（needReset）{
            触发器（el，'change'）;
          }
        }
      }
    }
  };

  function setSelected（el，binding，vm）{
    actualSetSelected（el，binding，vm）;
    / *伊斯坦布尔忽略如果* /
    if（isIE || isEdge）{
      setTimeout（function（）{
        actualSetSelected（el，binding，vm）;
      }，0）;
    }
  }

  function actualSetSelected（el，binding，vm）{
    var value = binding.value;
    var isMultiple = el.multiple;
    if（isMultiple &&！Array.isArray（value））{
      警告（
        “<选择多个v-model = \”“+（binding.expression）+”\“>”+
        “期望一个Array值用于绑定，但得到了”+（Object.prototype.toString.call（value）.slice（8，-1）），
        VM
      ）;
      返回
    }
    var selected，option;
    for（var i = 0，l = el.options.length; i <l; i ++）{
      option = el.options [i];
      if（isMultiple）{
        selected = looseIndexOf（value，getValue（option））> -1;
        if（option.selected！== selected）{
          option.selected = selected;
        }
      } else {
        if（looseEqual（getValue（option），value））{
          if（el.selectedIndex！== i）{
            el.selectedIndex = i;
          }
          返回
        }
      }
    }
    if（！isMultiple）{
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption（value，options）{
    return options.every（function（o）{return！looseEqual（o，value）;}）
  }

  function getValue（option）{
    在选项中返回'_value'
      ？option._value
      ：option.value
  }

  function onCompositionStart（e）{
    e.target.composing = true;
  }

  function onCompositionEnd（e）{
    //防止无缘无故地触发输入事件
    if（！e.target.composing）{return}
    e.target.composing = false;
    触发器（e.target，'input'）;
  }

  函数触发器（el，type）{
    var e = document.createEvent（'HTMLEvents'）;
    e.initEvent（type，true，true）;
    el.dispatchEvent（E）;
  }

  / * * /

  //递归搜索组件根目录中定义的可能转换
  function locateNode（vnode）{
    return vnode.componentInstance &&（！vnode.data ||！vnode.data.transition）
      ？locateNode（vnode.componentInstance._vnode）
      ：vnode
  }

  var show = {
    bind：function bind（el，ref，vnode）{
      var value = ref.value;

      vnode = locateNode（vnode）;
      var transition $$ 1 = vnode.data && vnode.data.transition;
      var originalDisplay = el .__ vOriginalDisplay =
        el.style.display ==='无'？''：el.style.display;
      if（value && transition $$ 1）{
        vnode.data.show = true;
        输入（vnode，function（）{
          el.style.display = originalDisplay;
        }）;
      } else {
        el.style.display = value？originalDisplay：'none';
      }
    }，

    更新：函数更新（el，ref，vnode）{
      var value = ref.value;
      var oldValue = ref.oldValue;

      / *伊斯坦布尔忽略如果* /
      if（！value ===！oldValue）{return}
      vnode = locateNode（vnode）;
      var transition $$ 1 = vnode.data && vnode.data.transition;
      if（transition $$ 1）{
        vnode.data.show = true;
        if（value）{
          输入（vnode，function（）{
            el.style.display = el .__ vOriginalDisplay;
          }）;
        } else {
          离开（vnode，function（）{
            el.style.display ='none';
          }）;
        }
      } else {
        el.style.display = value？el .__ vOriginalDisplay：'none';
      }
    }，

    unbind：function unbind（
      埃尔，
      捆绑，
      虚拟节点，
      oldVnode，
      isDestroy
    ）{
      if（！isDestroy）{
        el.style.display = el .__ vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model：指令，
    show：show
  };

  / * * /

  var transitionProps = {
    name：String，
    出现：布尔值，
    css：布尔值，
    mode：String，
    type：String，
    enterClass：String，
    leaveClass：String，
    enterToClass：String，
    leaveToClass：String，
    enterActiveClass：String，
    leaveActiveClass：String，
    appearClass：String，
    appearActiveClass：String，
    appearToClass：String，
    持续时间：[数字，字符串，对象]
  };

  //如果孩子也是一个抽象的组件，例如<keep-alive>
  //我们想以递归方式检索要呈现的实际组件
  function getRealChild（vnode）{
    var compOptions = vnode && vnode.componentOptions;
    if（compOptions && compOptions.Ctor.options.abstract）{
      return getRealChild（getFirstComponentChild（compOptions.children））
    } else {
      返回vnode
    }
  }

  function extractTransitionData（comp）{
    var data = {};
    var options = comp。$ options;
    // 道具
    for（options.propsData中的var key）{
      data [key] = comp [key];
    }
    //事件
    //提取侦听器并将它们直接传递给转换方法
    var listeners = options._parentListeners;
    for（监听器中的var key $ 1）{
      data [camelize（key $ 1）] = listeners [key $ 1];
    }
    返回数据
  }

  function占位符（h，rawChild）{
    if（/\d-keep-alive$/.test(rawChild.tag））{
      返回h（'keep-alive'，{
        props：rawChild.componentOptions.propsData
      }）
    }
  }

  function hasParentTransition（vnode）{
    while（（vnode = vnode.parent））{
      if（vnode.data.transition）{
        返回true
      }
    }
  }

  function isSameChild（child，oldChild）{
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function（c）{return c.tag || isAsyncPlaceholder（C）; };

  var isVShowDirective = function（d）{return d.name ==='show'; };

  var Transition = {
    名称：'过渡'，
    道具：transitionProps，
    摘要：是的，

    render：function render（h）{
      var这$ 1 =这个;

      var children = this。$ slots.default;
      if（！children）{
        返回
      }

      //过滤掉文本节点（可能的空格）
      children = children.filter（isNotTextNode）;
      / *伊斯坦布尔忽略如果* /
      if（！children.length）{
        返回
      }

      //警告多个元素
      if（children.length> 1）{
        警告（
          '<transition>只能用于单个元素。使用'+
          '<transition-group> for lists。'，
          这一点。$父
        ）;
      }

      var mode = this.mode;

      //警告无效模式
      if（mode && mode！=='in-out'&& mode！=='out-in'
      ）{
        警告（
          '无效<转换>模式：'+模式，
          这一点。$父
        ）;
      }

      var rawChild = children [0];

      //如果这是组件根节点和组件的
      //父容器节点也有转换，跳过。
      if（hasParentTransition（this。$ vnode））{
        返回rawChild
      }

      //将转换数据应用于子级
      //使用getRealChild（）忽略抽象组件，例如keep-alive
      var child = getRealChild（rawChild）;
      / *伊斯坦布尔忽略如果* /
      if（！child）{
        返回rawChild
      }

      if（this._leaving）{
        返回占位符（h，rawChild）
      }

      //确保vnode类型和此转换所特有的键
      //组件实例 此密钥将用于删除待处理的离开节点
      //在进入期间
      var id =“__ transnsition-”+（this._uid）+“ - ”;
      child.key = child.key == null
        ？child.isComment
          ？id +'comment'
          ：id + child.tag
        ：isPr imitive（child.key）
          ？（String（child.key）.indexOf（id）=== 0？child.key：id + child.key）
          ：child.key;

      var data =（child.data ||（child.data = {}））。transition = extractTransitionData（this）;
      var oldRawChild = this._vnode;
      var oldChild = getRealChild（oldRawChild）;

      //标记v-show
      //以便转换模块可以将控件移交给指令
      if（child.data.directives && child.data.directives.some（isVShowDirective））{
        child.data.show = true;
      }

      如果（
        oldChild &&
        oldChild.data &&
        ！isSameChild（child，oldChild）&&
        ！isAsyncPlaceholder（oldChild）&&
        //＃6687组件根是注释节点
        ！（oldChild.componentInstance && oldChild.componentInstance._vnode.isComment）
      ）{
        //用新的转换数据替换旧的子转换数据
        //对于动态过渡很重要！
        var oldData = oldChild.data.transition = extend（{}，data）;
        //处理过渡模式
        if（mode ==='out-in'）{
          //休假结束后返回占位符节点和队列更新
          this._leaving = true;
          mergeVNodeHook（oldData，'afterLeave'，function（）{
            这$ 1._leaving = false;
            这$ 1. $ forceUpdate（）;
          }）;
          返回占位符（h，rawChild）
        } else if（mode ==='in-out'）{
          if（isAsyncPlaceholder（child））{
            返回oldRawChild
          }
          var delayedLeave;
          var performLeave = function（）{delayedLeave（）; };
          mergeVNodeHook（data，'afterEnter'，performLeave）;
          mergeVNodeHook（data，'enterCancelled'，performLeave）;
          mergeVNodeHook（oldData，'delayLeave'，function（leave）{delayedLeave = leave;}）;
        }
      }

      返回rawChild
    }
  };

  / * * /

  var props = extend（{
    tag：String，
    moveClass：String
  }，transitionProps）;

  删除props.mode;

  var TransitionGroup = {
    道具：道具，

    beforeMount：function beforeMount（）{
      var这$ 1 =这个;

      var update = this._update;
      this._update = function（vnode，hydrating）{
        var restoreActiveInstance = setActiveInstance（此$ 1）;
        //强行删除通行证
        这$ 1 .__补丁__（
          此$ 1._vnode，
          此$ 1.kept，
          假，//保湿
          true // removeOnly（！important，避免不必要的动作）
        ）;
        这$ 1._vnode =这$ 1.kept;
        restoreActiveInstance（）;
        update.call（这个$ 1，vnode，保湿）;
      };
    }，

    render：function render（h）{
      var tag = this.tag || 这个。$ vnode.data.tag || '跨度';
      var map = Object.create（null）;
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this。$ slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData（this）;

      for（var i = 0; i <rawChildren.length; i ++）{
        var c = rawChildren [i];
        if（c.tag）{
          if（c.key！= null && String（c.key）.indexOf（'__ vlist'）！== 0）{
            children.push（C）;
            map [c.key] = c
            ;（c.data ||（c.data = {}））。transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts？（opts.Ctor.options.name || opts.tag ||''）：c.tag;
            warn（（“<transition-group> children必须键入：<”+ name +“>”））;
          }
        }
      }

      if（prevChildren）{
        var keep = [];
        var removed = [];
        for（var i $ 1 = 0; i $ 1 <prevChildren.length; i $ 1 ++）{
          var c $ 1 = prevChildren [i $ 1];
          c $ 1.data.transition = transitionData;
          c $ 1.data.pos = c $ 1.elm.getBoundingClientRect（）;
          if（map [c $ 1.key]）{
            kept.push（C $ 1）;
          } else {
            removed.push（C $ 1）;
          }
        }
        this.kept = h（tag，null，keep）;
        this.removed =删除;
      }

      return h（tag，null，children）
    }，

    已更新：function updated（）{
      var children = this.prevChildren;
      var moveClass = this.moveClass || （（this.name ||'v'）+' -  move'）;
      if（！children.length ||！this.hasMove（children [0] .elm，moveClass））{
        返回
      }

      //我们将工作分成三个循环，以避免混合DOM读写
      //在每次迭代中 - 这有助于防止布局颠簸。
      children.forEach（callPendingCbs）;
      children.forEach（recordPosition）;
      children.forEach（applyTranslation）;

      //强制回流将所有东西放在适当的位置
      //指定给它以避免在树木震动中移除
      // $ flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach（function（c）{
        if（c.data.moved）{
          var el = c.elm;
          var s = el.style;
          addTransitionClass（el，moveClass）;
          s.transform = s.WebkitTransform = s.transitionDuration ='';
          el.addEventListener（transitionEndEvent，el._moveCb = function cb（e）{
            if（e && e.target！== el）{
              返回
            }
            if（！e || /transform$/.test(e.propertyName））{
              el.removeEventListener（transitionEndEvent，cb）;
              el._moveCb = null;
              removeTransitionClass（el，moveClass）;
            }
          }）;
        }
      }）;
    }，

    方法： {
      hasMove：function hasMove（el，moveClass）{
        / *伊斯坦布尔忽略如果* /
        if（！hasTransition）{
          返回false
        }
        / *伊斯坦布尔忽略如果* /
        if（this._hasMove）{
          返回this._hasMove
        }
        //检测是否应用了移动类的元素
        // CSS过渡 由于元素可能在进入内部
        //在此刻转换，我们复制它并删除
        //应用所有其他过渡类以确保仅移动类
        // 被申请;被应用。
        var clone = el.cloneNode（）;
        if（el._transitionClasses）{
          el._transitionClasses.forEach（function（cls）{removeClass（clone，cls）;}）;
        }
        addClass（clone，moveClass）;
        clone.style.display ='none';
        此$ el.appendChild（克隆）。
        var info = getTransitionInfo（clone）;
        此$ el.removeChild（克隆）。
        return（this._hasMove = info.hasTransform）
      }
    }
  };

  function callPendingCbs（c）{
    / *伊斯坦布尔忽略如果* /
    if（c.elm._moveCb）{
      c.elm._moveCb（）;
    }
    / *伊斯坦布尔忽略如果* /
    if（c.elm._enterCb）{
      c.elm._enterCb（）;
    }
  }

  function recordPosition（c）{
    c.data.newPos = c.elm.getBoundingClientRect（）;
  }

  function applyTranslation（c）{
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left  -  newPos.left;
    var dy = oldPos.top  -  newPos.top;
    if（dx || dy）{
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform =“translate（”+ dx +“px，”+ dy +“px）”;
      s.transitionDuration ='0s';
    }
  }

  var platformComponents = {
    过渡：过渡，
    TransitionGroup：TransitionGroup
  };

  / * * /

  //安装平台特定的工具
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  //安装平台运行时指令和组件
  extend（Vue.options.directives，platformDirectives）;
  extend（Vue.options.components，platformComponents）;

  //安装平台补丁功能
  Vue.prototype .__ patch__ = inBrowser？补丁：noop;

  //公共安装方法
  Vue.prototype。$ mount = function（
    埃尔，
    保湿
  ）{
    el = el && inBrowser？query（el）：undefined;
    return mountComponent（this，el，hydrating）
  };

  // devtools全局钩子
  / * istanbul忽略下一个* /
  if（inBrowser）{
    setTimeout（function（）{
      if（config.devtools）{
        if（devtools）{
          devtools.emit（'init'，Vue）;
        } else {
          控制台[console.info？'info'：'log']（
            '下载Vue Devtools扩展以获得更好的开发体验：\ n'+
            'https://github.com/vuejs/vue-devtools'
          ）;
        }
      }
      if（config.productionTip！== false &&
        typeof console！=='undefined'
      ）{
        控制台[console.info？'info'：'log']（
          “您正在开发模式下运行Vue。\ n”+
          “确保在部署生产时打开生产模式。\ n”+
          “请访问https://vuejs.org/guide/deployment.html查看更多提示”
        ）;
      }
    }，0）;
  }

  / * * /

  var defaultTagRE = /\{\{((?:.|\\\\n)+？）}}}}}}}
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached（function（delimiters）{
    var open = delimiters [0] .replace（regexEscapeRE，'\\ $＆'）;
    var close = delimiters [1] .replace（regexEscapeRE，'\\ $＆'）;
    返回新的RegExp（打开+'（（？：。| \\ n）+？）'+ close，'g'）
  }）;



  function parseText（
    文本，
    分隔符
  ）{
    var tagRE =分隔符？buildRegex（delimiters）：defaultTagRE;
    if（！tagRE.test（text））{
      返回
    }
    var tokens = [];
    var rawTokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match，index，tokenValue;
    while（（match = tagRE.exec（text）））{
      index = match.index;
      //推送文本标记
      if（index> lastIndex）{
        rawTokens.push（tokenValue = text.slice（lastIndex，index））;
        tokens.push（JSON.stringify（tokenValue））;
      }
      //标记令牌
      var exp = parseFilters（match [1] .trim（））;
      tokens.push（（“_ s（”+ exp +“）”））;
      rawTokens.push（{'@ binding'：exp}）;
      lastIndex = index + match [0] .length;
    }
    if（lastIndex <text.length）{
      rawTokens.push（tokenValue = text.slice（lastIndex））;
      tokens.push（JSON.stringify（tokenValue））;
    }
    返回{
      表达式：tokens.join（'+'），
      令牌：rawTokens
    }
  }

  / * * /

  function transformNode（el，options）{
    var warn = options.warn || baseWarn;
    var staticClass = getAndRemoveAttr（el，'class'）;
    if（staticClass）{
      var res = parseText（staticClass，options.delimiters）;
      if（res）{
        警告（
          “class = \”“+ staticClass +”\“：”+
          '内部属性的插值已被删除。'+
          '改用v-bind或冒号。例如，'+
          '而不是<div class =“{{val}}”>，使用<div：class =“val”>。'，
          el.rawAttrsMap [ '类']
        ）;
      }
    }
    if（staticClass）{
      el.staticClass = JSON.stringify（staticClass）;
    }
    var classBinding = getBindingAttr（el，'class'，false / * getStatic * /）;
    if（classBinding）{
      el.classBinding = classBinding;
    }
  }

  function genData（el）{
    var data ='';
    if（el.staticClass）{
      data + =“staticClass：”+（el.staticClass）+“，”;
    }
    if（el.classBinding）{
      data + =“class：”+（el.classBinding）+“，”;
    }
    返回数据
  }

  var klass $ 1 = {
    staticKeys：['staticClass']，
    transformNode：transformNode，
    genData：genData
  };

  / * * /

  function transformNode $ 1（el，options）{
    var warn = options.warn || baseWarn;
    var staticStyle = getAndRemoveAttr（el，'style'）;
    if（staticStyle）{
      / *伊斯坦布尔忽略如果* /
      {
        var res = parseText（staticStyle，options.delimiters）;
        if（res）{
          警告（
            “style = \”“+ staticStyle +”\“：”+
            '内部属性的插值已被删除。'+
            '改用v-bind或冒号。例如，'+
            '而不是<div style =“{{val}}”>，使用<div：style =“val”>。'，
            el.rawAttrsMap [ '风格']
          ）;
        }
      }
      el.staticStyle = JSON.stringify（parseStyleText（staticStyle））;
    }

    var styleBinding = getBindingAttr（el，'style'，false / * getStatic * /）;
    if（styleBinding）{
      el.styleBinding = styleBinding;
    }
  }

  function genData $ 1（el）{
    var data ='';
    if（el.staticStyle）{
      data + =“staticStyle：”+（el.staticStyle）+“，”;
    }
    if（el.styleBinding）{
      data + =“style :(”+（el.styleBinding）+“），”;
    }
    返回数据
  }

  var style $ 1 = {
    staticKeys：['staticStyle']，
    transformNode：transformNode $ 1，
    genData：genData $ 1
  };

  / * * /

  var解码器;

  var he = {
    decode：function decode（html）{
      decoder = decoder || 使用document.createElement（ 'DIV'）;
      decoder.innerHTML = html;
      return decoder.textContent
    }
  };

  / * * /

  var isUnaryTag = makeMap（
    'area，base，br，col，embed，frame，hr，img，input，isindex，keygen，'+
    '链接，元，PARAM，源，跟踪，WBR'
  ）;

  //你可以故意保持开放的元素
  //（并关闭自己）
  var canBeLeftOpenTag = makeMap（
    'COLGROUP，DD，DT，李，期权，P，TD，TFOOT，TH，THEAD，TR，源'
  ）;

  // HTML5标签https://html.spec.whatwg.org/multipage/indices.html#elements-3
  //短语内容https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap（
    '地址，文章，旁边，基地，blockquote，正文，标题，col，colgroup，dd，'+
    '详细信息，对话框，div，dl，dt，fieldset，figcaption，figure，footer，form，'+
    'h1，h2，h3，h4，h5，h6，head，header，hgroup，hr，html，legend，li，menuitem，meta，'+
    'optgroup，option，param，rp，rt，source，style，summary，tbody，td，tfoot，th，thead，'+
    '称号，TR，跟踪'
  ）;

  / **
   *不对此文件进行类型检查，因为它主要是供应商代码。
   * /

  //用于解析标记和属性的正则表达式
  var attribute = / ^ \ s *（[^ \ s“'<> \ / =] +）（？：\ s *（=）\ s *（？：”（[^“] *）”+ |' （[^ '] *）' + |（[^ \ S“'= <>`] +）））/？;
  var dynamicArgAttribute = / ^ \ s *（（？：v  -  [\ w  - ] +：| @ |：|＃）\ [[^ =] + \] [^ \ s“'<> \ / =] * ）（？：\ S *（=）\ S *（?: “（[^”] *） “+ | '（[^'] *）'+ |（[^ \ S”'= <>`] +）））/？;
  var ncname =“[a-zA-Z _] [\\  -  \\。0-9_a-zA-Z”+（unicodeRegExp.source）+“] *”;
  var qnameCapture =“（（？：”+ ncname +“\\ :)？”+ ncname +“）”;
  var startTagOpen = new RegExp（（“^ <”+ qnameCapture））;
  var startTagClose = / ^ \ s *（\ /？）> /;
  var endTag = new RegExp（（“^ <\\ /”+ qnameCapture +“[^>] *>”））;
  var doctype = / ^ <！DOCTYPE [^>] +> / i;
  //＃7298：escape  - 避免在页面内联时被视为HTML注释
  var comment = / ^ <！\  -  /;
  var conditionalComment = / ^ <！\ [/;

  //特殊元素（可以包含任何东西）
  var isPlainTextElement = makeMap（'script，style，textarea'，true）;
  var reCache = {};

  var decodingMap = {
    '＆lt;'：'<'，
    '＆gt;'：'>'，
    ''''''''，
    '＆amp;'：'＆'，
    '＆＃10;'：'\ n'，
    '＆＃9;'：'\ t'，
    '＆＃39;'：“'”
  };
  var encodedAttr = /＆（？：lt | gt | quot | amp |＃39）; / g;
  var encodedAttrWithNewLines = /＆（？：lt | gt | quot | amp |＃39 |＃10 |＃9）; / g;

  //＃5992
  var isIgnoreNewlineTag = makeMap（'pre，textarea'，true）;
  var shouldIgnoreFirstNewline = function（tag，html）{return tag && isIgnoreNewlineTag（tag）&& html [0] ==='\ n'; };

  function decodeAttr（value，shouldDecodeNewlines）{
    var re = shouldDecodeNewlines？encodedAttrWithNewLines：encodedAttr;
    return value.replace（re，function（match）{return decodingMap [match];}）
  }

  function parseHTML（html，options）{
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag $$ 1 = options.isUnaryTag || 没有;
    var canBeLeftOpenTag $$ 1 = options.canBeLeftOpenTag || 没有;
    var index = 0;
    var last，lastTag;
    while（html）{
      last = html;
      //确保我们不是像脚本/样式那样的纯文本内容元素
      if（！lastTag ||！isPlainTextElement（lastTag））{
        var textEnd = html.indexOf（'<'）;
        if（textEnd === 0）{
          //评论：
          if（comment.test（html））{
            var commentEnd = html.indexOf（' - >'）;

            if（commentEnd> = 0）{
              if（options.shouldKeepComment）{
                options.comment（html.substring（4，commentEnd），index，index + commentEnd + 3）;
              }
              提前（commentEnd + 3）;
              继续
            }
          }

          // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
          if（conditionalComment.test（html））{
            var conditionalEnd = html.indexOf（']>'）;

            if（conditionalEnd> = 0）{
              提前（conditionalEnd + 2）;
              继续
            }
          }

          // Doctype：
          var doctypeMatch = html.match（doctype）;
          if（doctypeMatch）{
            提前（doctypeMatch [0]。长度）;
            继续
          }

          //结束标记：
          var endTagMatch = html.match（endTag）;
          if（endTagMatch）{
            var curIndex = index;
            提前（endTagMatch [0]。长度）;
            parseEndTag（endTagMatch [1]，curIndex，index）;
            继续
          }

          //开始标记：
          var startTagMatch = parseStartTag（）;
          if（startTagMatch）{
            handleStartTag（startTagMatch）;
            if（shouldIgnoreFirstNewline（startTagMatch.tagName，html））{
              提前（1）;
            }
            继续
          }
        }

        var text =（void 0），rest =（void 0），next =（void 0）;
        if（textEnd> = 0）{
          rest = html.slice（textEnd）;
          而（
            ！endTag.test（休息）&&
            ！startTagOpen.test（rest）&&
            ！comment.test（rest）&&
            ！conditionalComment.test（休息）
          ）{
            // <在纯文本中，原谅并将其视为文本
            next = rest.indexOf（'<'，1）;
            if（next <0）{break}
            textEnd + = next;
            rest = html.slice（textEnd）;
          }
          text = html.substring（0，textEnd）;
        }

        if（textEnd <0）{
          text = html;
        }

        if（text）{
          提前（text.length）;
        }

        if（options.chars && text）{
          options.chars（text，index  -  text.length，index）;
        }
      } else {
        var endTagLength = 0;
        var stackedTag = lastTag.toLowerCase（）;
        var reStackedTag = reCache [stackedTag] || （reCache [stackedTag] =新的RegExp（'（[\\ s \\ S] *？）（</'+ stackedTag +'[^>] *>）'，'i'））;
        var rest $ 1 = html.replace（reStackedTag，function（all，text，endTag）{
          endTagLength = endTag.length;
          if（！isPlainTextElement（stackedTag）&& stackedTag！=='noscript'）{
            text =文字
              .replace（/ <！\  - （[\ s \ S] *？） - > / g，'$ 1'）//＃7298
              .replace（/ <！\ [CDATA \ [（[\ s \ S] *？）]]> / g，'$ 1'）;
          }
          if（shouldIgnoreFirstNewline（stackedTag，text））{
            text = text.slice（1）;
          }
          if（options.chars）{
            options.chars（文本）;
          }
          回归''
        }）;
        index + = html.length  -  rest $ 1.length;
        html = rest $ 1;
        parseEndTag（stackedTag，index  -  endTagLength，index）;
      }

      if（html === last）{
        options.chars && options.chars（html）;
        if（！stack.length && options.warn）{
          options.warn（（“模板末尾的Mal格式标签：\”“+ html +”\“”），{start：index + html.length}）;
        }
        打破
      }
    }

    //清理所有剩余的标签
    parseEndTag（）;

    function advance（n）{
      index + = n;
      html = html.substring（n）;
    }

    function parseStartTag（）{
      var start = html.match（startTagOpen）;
      if（start）{
        var match = {
          tagName：start [1]，
          attrs：[]，
          开始：索引
        };
        提前（启动[0]。长度）;
        var end，attr;
        while（！（end = html.match（startTagClose））&&（attr = html.match（dynamicArgAttribute）|| html.match（attribute）））{
          attr.start = index;
          提前（ATTR [0]。长度）;
          attr.end = index;
          match.attrs.push（ATTR）;
        }
        if（end）{
          match.unarySlash = end [1];
          提前（端[0]。长度）;
          match.end = index;
          回归比赛
        }
      }
    }

    function handleStartTag（match）{
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      if（expectHTML）{
        if（lastTag ==='p'&& isNonPhrasingTag（tagName））{
          parseEndTag（lastTag）;
        }
        if（canBeLeftOpenTag $$ 1（tagName）&& lastTag === tagName）{
          parseEndTag（标签名）;
        }
      }

      var unary = isUnaryTag $$ 1（tagName）|| ！unarySlash;

      var l = match.attrs.length;
      var attrs = new Array（l）;
      for（var i = 0; i <l; i ++）{
        var args = match.attrs [i];
        var value = args [3] || args [4] || args [5] || '';
        var shouldDecodeNewlines = tagName ==='a'&& args [1] ==='href'
          ？options.shouldDecodeNewlinesForHref
          ：options.shouldDecodeNewlines;
        attrs [i] = {
          名称：args [1]，
          value：decodeAttr（value，shouldDecodeNewlines）
        };
        if（options.outputSourceRange）{
          attrs [i] .start = args.start + args [0] .match（/ ^ \ s * /）。length;
          attrs [i] .end = args.end;
        }
      }

      if（！unary）{
        stack.push（{tag：tagName，lowerCasedTag：tagName.toLowerCase（），attrs：attrs，start：match.start，end：match.end}）;
        lastTag = tagName;
      }

      if（options.start）{
        options.start（tagName，attrs，unary，match.start，match.end）;
      }
    }

    function parseEndTag（tagName，start，end）{
      var pos，lowerCasedTagName;
      if（start == null）{start = index; }
      if（end == null）{end = index; }

      //找到相同类型的最近打开的标签
      if（tagName）{
        lowerCasedTagName = tagName.toLowerCase（）;
        for（pos = stack.length  -  1; pos> = 0; pos--）{
          if（stack [pos] .lowerCasedTag === lowerCasedTagName）{
            打破
          }
        }
      } else {
        //如果没有提供标签名称，请清理商店
        pos = 0;
      }

      if（pos> = 0）{
        //关闭堆栈中的所有打开元素
        for（var i = stack.length  -  1; i> = pos; i--）{
          if（i> pos ||！tagName &&
            options.warn
          ）{
            options.warn（
              （“tag <”+（stack [i] .tag）+“>没有匹配的结束标记。”），
              {start：stack [i] .start，end：stack [i] .end}
            ）;
          }
          if（options.end）{
            options.end（stack [i] .tag，start，end）;
          }
        }

        //从堆栈中删除打开的元素
        stack.length = pos;
        lastTag = pos && stack [pos  -  1] .tag;
      } else if（lowerCasedTagName ==='br'）{
        if（options.start）{
          options.start（tagName，[]，true，start，end）;
        }
      } else if（lowerCasedTagName ==='p'）{
        if（options.start）{
          options.start（tagName，[]，false，start，end）;
        }
        if（options.end）{
          options.end（tagName，start，end）;
        }
      }
    }
  }

  / * * /

  var onRE = / ^ @ | ^ v-on：/;
  var dirRE = / ^ v- | ^ @ | ^：/;
  var forAliasRE = /（[\ s \ S] *？）\ s +（？：in | of）\ s +（[\ s \ S] *）/;
  var forIteratorRE = /，（[^，\} \]] *）（？：，（[^，\} \]] *））？$ /;
  var stripParensRE = / ^ \（| \）$ / g;
  var dynamicArgRE = /^\ [。*] $ /;

  var argRE = /:(.*)$/;
  var bindRE = /^:|^\.|^v-bind：/;
  var modifierRE = /\。[^.\]] +（？= [^ []] * $）/ g;

  var slotRE = / ^ v-slot（：| $）| ^＃/;

  var lineBreakRE = / [\ r \ n] /;
  var whitespaceRE $ 1 = / \ s + / g;

  var invalidAttributeRE = / [\ s“'<> \ / =] /;

  var decodeHTMLCached = cached（he.decode）;

  var emptySlotScopeToken =“_ empty_”;

  //可配置状态
  var警告2美元;
  var delimiters;
  变换;
  var preTransforms;
  var postTransforms;
  var platformIsPreTag;
  var platformMustUseProp;
  var platformGetTagNamespace;
  var maybeComponent;

  function createASTElement（
    标签，
    ATTRS，
    亲
  ）{
    返回{
      类型：1，
      标签：标签，
      attrsList：attrs，
      attrsMap：makeAttrsMap（attrs），
      rawAttrsMap：{}，
      父母：父母，
      孩子：[]
    }
  }

  / **
   *将HTML字符串转换为AST。
   * /
  功能解析（
    模板，
    选项
  ）{
    警告$ 2 = options.warn || baseWarn;

    platformIsPreTag = options.isPreTag || 没有;
    platformMustUseProp = options.mustUseProp || 没有;
    platformGetTagNamespace = options.getTagNamespace || 没有;
    var isReservedTag = options.isReservedTag || 没有;
    maybeComponent = function（el）{return !! el.component || ！isReservedTag（el.tag）; };

    transforms = pluckModuleFunction（options.modules，'transformNode'）;
    preTransforms = pluckModuleFunction（options.modules，'preTransformNode'）;
    postTransforms = pluckModuleFunction（options.modules，'postTransformNode'）;

    delimiters = options.delimiters;

    var stack = [];
    var preserveWhitespace = options.preserveWhitespace！== false;
    var whitespaceOption = options.whitespace;
    var root;
    var currentParent;
    var inVPre = false;
    var inPre = false;
    var warned = false;

    function warnOnce（msg，range）{
      if（！警告）{
        警告=真;
        警告$ 2（msg，范围）;
      }
    }

    function closeElement（element）{
      trimEndingWhitespace（元件）;
      if（！inVPre &&！element.processed）{
        element = processElement（element，options）;
      }
      //树木管理
      if（！stack.length && element！== root）{
        //允许使用v-if，v-else-if和v-else的根元素
        if（root.if &&（element.elseif || element.else））{
          {
            checkRootConstraints（元件）;
          }
          addIfCondition（root，{
            exp：element.elseif，
            块：元素
          }）;
        } else {
          warnOnce（
            “组件模板应该只包含一个根元素。”+
            “如果你在多个元素上使用v-if，”+
            “使用v-else-if链接它们。”，
            {start：element.start}
          ）;
        }
      }
      if（currentParent &&！element.forbidden）{
        if（element.elseif || element.else）{
          processIfConditions（element，currentParent）;
        } else {
          if（element.slotScope）{
            //范围广告位
            //将它保存在子列表中，以便v-else（-if）条件可以
            //找到它作为prev节点。
            var name = element.slotTarget || '“默认”'
            ;（currentParent.scopedSlots ||（currentParent.scopedSlots = {}））[name] = element;
          }
          currentParent.children.push（元件）;
          element.parent = currentParent;
        }
      }

      //最后的孩子清理
      //过滤掉范围的广告位
      element.children = element.children.filter（function（c）{return！（c）.slotScope;}）;
      //再次删除尾随空格节点
      trimEndingWhitespace（元件）;

      //检查预先状态
      if（element.pre）{
        inVPre = false;
      }
      if（platformIsPreTag（element.tag））{
        inPre = false;
      }
      //应用后变换
      for（var i = 0; i <postTransforms.length; i ++）{
        postTransforms [i]（元素，选项）;
      }
    }

    function trimEndingWhitespace（el）{
      //删除尾随空格节点
      if（！inPre）{
        var lastNode;
        而（
          （lastNode = el.children [el.children.length  -  1]）&&
          lastNode.type === 3 &&
          lastNode.text ===''
        ）{
          el.children.pop（）;
        }
      }
    }

    function checkRootConstraints（el）{
      if（el.tag ==='slot'|| el.tag ==='template'）{
        warnOnce（
          “不能使用<”+（el.tag）+“>作为组件根元素，因为它可能是”+“
          '包含多个节点。'，
          {start：el.start}
        ）;
      }
      if（el.attrsMap.hasOwnProperty（'v-for'））{
        warnOnce（
          '不能在有状态组件根元素上使用v-for，因为'+
          '它渲染了多个元素。'，
          el.rawAttrsMap [ 'V-关于']
        ）;
      }
    }

    parseHTML（template，{
      警告：警告2美元，
      expectHTML：options.expectHTML，
      isUnaryTag：options.isUnaryTag，
      canBeLeftOpenTag：options.canBeLeftOpenTag，
      shouldDecodeNewlines：options.shouldDecodeNewlines，
      shouldDecodeNewlinesForHref：options.shouldDecodeNewlinesForHref，
      shouldKeepComment：options.comments，
      outputSourceRange：options.outputSourceRange，
      start：function start（tag，attrs，unary，start $ 1，end）{
        //检查命名空间。
        //如果有父ns，则继承父ns
        var ns =（currentParent && currentParent.ns）|| platformGetTagNamespace（标签）;

        //处理IE svg bug
        / *伊斯坦布尔忽略如果* /
        if（isIE && ns ==='svg'）{
          attrs = guardIESVGBug（attrs）;
        }

        var element = createASTElement（tag，attrs，currentParent）;
        if（ns）{
          element.ns = ns;
        }

        {
          if（options.outputSourceRange）{
            element.start = start $ 1;
            element.end = end;
            element.rawAttrsMap = element.attrsList.reduce（function（cumulated，attr）{
              累计[attr.name] = attr;
              返回累积
            }，{}）;
          }
          attrs.forEach（function（attr）{
            if（invalidAttributeRE.test（attr.name））{
              警告$ 2（
                “无效的动态参数表达式：属性名称不能包含”+
                “空格，引号，<，>，/或=。”，
                {
                  start：attr.start + attr.name.indexOf（“[”），
                  结束：attr.start + attr.name.length
                }
              ）;
            }
          }）;
        }

        if（isForbiddenTag（element）&&！isServerRendering（））{
          element.forbidden = true;
          警告$ 2（
            '模板应该只负责将状态映射到'+
            “UI。避免在模板中放置带副作用的标签，例如'+
            “<”+ tag +“>”+“，因为它们不会被解析。'，
            {start：element.start}
          ）;
        }

        //应用预转换
        for（var i = 0; i <preTransforms.length; i ++）{
          element = preTransforms [i]（element，options）|| 元件;
        }

        if（！inVPre）{
          processPre（元件）;
          if（element.pre）{
            inVPre = true;
          }
        }
        if（platformIsPreTag（element.tag））{
          inPre = true;
        }
        if（inVPre）{
          processRawAttrs（元件）;
        } else if（！element.processed）{
          //结构指令
          过程模拟（元件）;
          processIf（元件）;
          processOnce（元件）;
        }

        if（！root）{
          root = element;
          {
            checkRootConstraints（根）;
          }
        }

        if（！unary）{
          currentParent = element;
          stack.push（元件）;
        } else {
          closeElement（元件）;
        }
      }，

      结束：函数结束（标记，开始，结束$ 1）{
        var element = stack [stack.length  -  1];
        // pop堆栈
        stack.length  -  = 1;
        currentParent = stack [stack.length  -  1];
        if（options.outputSourceRange）{
          element.end = end $ 1;
        }
        closeElement（元件）;
      }，

      chars：function chars（text，start，end）{
        if（！currentParent）{
          {
            if（text === template）{
              warnOnce（
                '组件模板需要一个根元素，而不仅仅是文本。'，
                {start：start}
              ）;
            } else if（（text = text.trim（）））{
              warnOnce（
                （“text”“”+ text +“\”外部根元素将被忽略。“），
                {start：start}
              ）;
            }
          }
          返回
        }
        // IE textarea占位符错误
        / *伊斯坦布尔忽略如果* /
        if（isIE &&
          currentParent.tag ==='textarea'&&
          currentParent.attrsMap.placeholder === text
        ）{
          返回
        }
        var children = currentParent.children;
        if（inPre || text.trim（））{
          text = isTextTag（currentParent）？text：decodeHTMLCached（text）;
        } else if（！children.length）{
          //在开始标记后面删除仅空白节点
          text ='';
        } else if（whitespaceOption）{
          if（whitespaceOption ==='condense'）{
            //在压缩模式下，删除包含的空白节点
            //换行，否则压缩到一个空格
            text = lineBreakRE.test（text）？''：'';
          } else {
            text ='';
          }
        } else {
          text = preserveWhitespace？''：'';
        }
        if（text）{
          if（！inPre && whitespaceOption ==='condense'）{
            //将连续的空格压缩到单个空格中
            text = text.replace（whitespaceRE $ 1，''）;
          }
          var res;
          var child;
          if（！inVPre && text！==''&&（res = parseText（text，delimiters）））{
            child = {
              类型：2，
              表达式：res.expression，
              代币：res.tokens，
              文字：文字
            };
          } else if（text！==''||！children.length || children [children.length  -  1] .text！==''）{
            child = {
              类型：3，
              文字：文字
            };
          }
          if（child）{
            if（options.outputSourceRange）{
              child.start = start;
              child.end = end;
            }
            children.push（孩子）;
          }
        }
      }，
      评论：功能评论（文字，开头，结尾）{
        //禁止将任意兄弟添加到根节点
        //仍应允许注释，但忽略
        if（currentParent）{
          var child = {
            类型：3，
            文字：文字，
            是评论：是的
          };
          if（options.outputSourceRange）{
            child.start = start;
            child.end = end;
          }
          currentParent.children.push（孩子）;
        }
      }
    }）;
    返回root
  }

  function processPre（el）{
    if（getAndRemoveAttr（el，'v-pre'）！= null）{
      el.pre = true;
    }
  }

  function processRawAttrs（el）{
    var list = el.attrsList;
    var len = list.length;
    if（len）{
      var attrs = el.attrs = new Array（len）;
      for（var i = 0; i <len; i ++）{
        attrs [i] = {
          name：list [i] .name，
          value：JSON.stringify（list [i] .value）
        };
        if（list [i] .start！= null）{
          attrs [i] .start = list [i] .start;
          attrs [i] .end = list [i] .end;
        }
      }
    } else if（！el.pre）{
      //没有属性的pre块中的非根节点
      el.plain = true;
    }
  }

  function processElement（
    元件，
    选项
  ）{
    processKey（元件）;

    //确定这是否是一个普通元素
    //删除结构属性
    element.plain =（
      ！element.key &&
      ！element.scopedSlots &&
      ！element.attrsList.length
    ）;

    processRef（元件）;
    processSlotContent（元件）;
    processSlotOutlet（元件）;
    processComponent（元件）;
    for（var i = 0; i <transforms.length; i ++）{
      element = transforms [i]（element，options）|| 元件;
    }
    processAttrs（元件）;
    返回元素
  }

  function processKey（el）{
    var exp = getBindingAttr（el，'key'）;
    if（exp）{
      {
        if（el.tag ==='template'）{
          警告$ 2（
            “<template>无法键入。请将键放在真实元素上。”，
            getRawBindingAttr（el，'key'）
          ）;
        }
        if（el.for）{
          var iterator = el.iterator2 || el.iterator1;
          var parent = el.parent;
          if（iterator && iterator === exp && parent && parent.tag ==='transition-group'）{
            警告$ 2（
              “不要在<transition-group> children上使用v-for index作为键，”+
              “这与不使用密钥相同。”，
              getRawBindingAttr（el，'key'），
              是/ *小费* /
            ）;
          }
        }
      }
      el.key = exp;
    }
  }

  function processRef（el）{
    var ref = getBindingAttr（el，'ref'）;
    if（ref）{
      el.ref = ref;
      el.refInFor = checkInFor（el）;
    }
  }

  function processFor（el）{
    var exp;
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      var res = parseFor(exp);
      if (res) {
        extend(el, res);
      } else {
        warn$2(
          ("Invalid v-for expression: " + exp),
          el.rawAttrsMap['v-for']
        );
      }
    }
  }



  function parseFor (exp) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) { return }
    var res = {};
    res.for = inMatch[2].trim();
    var alias = inMatch[1].trim().replace(stripParensRE, '');
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '').trim();
      res.iterator1 = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.iterator2 = iteratorMatch[2].trim();
      }
    } else {
      res.alias = alias;
    }
    return res
  }

  function processIf (el) {
    var exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      var elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  function processIfConditions (el, parent) {
    var prev = findPrevElement(parent.children);
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      });
    } else {
      warn$2(
        "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
        "used on element <" + (el.tag) + "> without corresponding v-if.",
        el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
      );
    }
  }

  function findPrevElement (children) {
    var i = children.length;
    while (i--) {
      if (children[i].type === 1) {
        return children[i]
      } else {
        if (children[i].text !== ' ') {
          warn$2(
            "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
            "will be ignored.",
            children[i]
          );
        }
        children.pop();
      }
    }
  }

  function addIfCondition (el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  function processOnce (el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }

  // handle content being passed to a component as slot,
  // e.g. <template slot="xxx">, <div slot-scope="xxx">
  function processSlotContent (el) {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if (slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          el.rawAttrsMap['scope'],
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          el.rawAttrsMap['slot-scope'],
          true
        );
      }
      el.slotScope = slotScope;
    }

    // slot="xxx"
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
      }
    }

    // 2.6 v-slot syntax
    {
      if (el.tag === 'template') {
        // v-slot on <template>
        var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding) {
          {
            if (el.slotTarget || el.slotScope) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.parent && !maybeComponent(el.parent)) {
              warn$2(
                "<template v-slot> can only appear at the root level inside " +
                "the receiving the component",
                el
              );
            }
          }
          var ref = getSlotName(slotBinding);
          var name = ref.name;
          var dynamic = ref.dynamic;
          el.slotTarget = name;
          el.slotTargetDynamic = dynamic;
          el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
        }
      } else {
        // v-slot on component, denotes default slot
        var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding$1) {
          {
            if (!maybeComponent(el)) {
              warn$2(
                "v-slot can only be used on components or <template>.",
                slotBinding$1
              );
            }
            if (el.slotScope || el.slotTarget) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.scopedSlots) {
              warn$2(
                "To avoid scope ambiguity, the default slot should also use " +
                "<template> syntax when there are other named slots.",
                slotBinding$1
              );
            }
          }
          // add the component's children to its default slot
          var slots = el.scopedSlots || (el.scopedSlots = {});
          var ref$1 = getSlotName(slotBinding$1);
          var name$1 = ref$1.name;
          var dynamic$1 = ref$1.dynamic;
          var slotContainer = slots[name$1] = createASTElement('template', [], el);
          slotContainer.slotTarget = name$1;
          slotContainer.slotTargetDynamic = dynamic$1;
          slotContainer.children = el.children.filter(function (c) {
            if (!c.slotScope) {
              c.parent = slotContainer;
              return true
            }
          });
          slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
          // remove children as they are returned from scopedSlots now
          el.children = [];
          // mark el non-plain so data gets generated
          el.plain = false;
        }
      }
    }
  }

  function getSlotName (binding) {
    var name = binding.name.replace(slotRE, '');
    if (!name) {
      if (binding.name[0] !== '#') {
        name = 'default';
      } else {
        warn$2(
          "v-slot shorthand syntax requires a slot name.",
          binding
        );
      }
    }
    return dynamicArgRE.test(name)
      // dynamic [name]
      ? { name: name.slice(1, -1), dynamic: true }
      // static name
      : { name: ("\"" + name + "\""), dynamic: false }
  }

  // handle <slot/> outlets
  function processSlotOutlet (el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name');
      if (el.key) {
        warn$2(
          "`key` does not work on <slot> because slots are abstract outlets " +
          "and can possibly expand into multiple elements. " +
          "Use the key on a wrapping element instead.",
          getRawBindingAttr(el, 'key')
        );
      }
    }
  }

  function processComponent (el) {
    var binding;
    if ((binding = getBindingAttr(el, 'is'))) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
      el.inlineTemplate = true;
    }
  }

  function processAttrs (el) {
    var list = el.attrsList;
    var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name;
      value = list[i].value;
      if (dirRE.test(name)) {
        // mark element as dynamic
        el.hasBindings = true;
        // modifiers
        modifiers = parseModifiers(name.replace(dirRE, ''));
        // support .foo shorthand syntax for the .prop modifier
        if (modifiers) {
          name = name.replace(modifierRE, '');
        }
        if (bindRE.test(name)) { // v-bind
          name = name.replace(bindRE, '');
          value = parseFilters(value);
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          if (
            value.trim().length === 0
          ) {
            warn$2(
              ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
            );
          }
          if (modifiers) {
            if (modifiers.prop && !isDynamic) {
              name = camelize(name);
              if (name === 'innerHtml') { name = 'innerHTML'; }
            }
            if (modifiers.camel && !isDynamic) {
              name = camelize(name);
            }
            if (modifiers.sync) {
              syncGen = genAssignmentCode(value, "$event");
              if (!isDynamic) {
                addHandler(
                  el,
                  ("update:" + (camelize(name))),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i]
                );
                if (hyphenate(name) !== camelize(name)) {
                  addHandler(
                    el,
                    ("update:" + (hyphenate(name))),
                    syncGen,
                    null,
                    false,
                    warn$2,
                    list[i]
                  );
                }
              } else {
                // handler w/ dynamic event name
                addHandler(
                  el,
                  ("\"update:\"+(" + name + ")"),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i],
                  true // dynamic
                );
              }
            }
          }
          if ((modifiers && modifiers.prop) || (
            !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
          )) {
            addProp(el, name, value, list[i], isDynamic);
          } else {
            addAttr(el, name, value, list[i], isDynamic);
          }
        } else if (onRE.test(name)) { // v-on
          name = name.replace(onRE, '');
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
        } else { // normal directives
          name = name.replace(dirRE, '');
          // parse arg
          var argMatch = name.match(argRE);
          var arg = argMatch && argMatch[1];
          isDynamic = false;
          if (arg) {
            name = name.slice(0, -(arg.length + 1));
            if (dynamicArgRE.test(arg)) {
              arg = arg.slice(1, -1);
              isDynamic = true;
            }
          }
          addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
          if (name === 'model') {
            checkForAliasModel(el, value);
          }
        }
      } else {
        // literal attribute
        {
          var res = parseText(value, delimiters);
          if (res) {
            warn$2(
              name + "=\"" + value + "\": " +
              'Interpolation inside attributes has been removed. ' +
              'Use v-bind or the colon shorthand instead. For example, ' +
              'instead of <div id="{{ val }}">, use <div :id="val">.',
              list[i]
            );
          }
        }
        addAttr(el, name, JSON.stringify(value), list[i]);
        // #6887 firefox doesn't update muted state if set via attribute
        // even immediately after element creation
        if (!el.component &&
            name === 'muted' &&
            platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, 'true', list[i]);
        }
      }
    }
  }

  function checkInFor (el) {
    var parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true
      }
      parent = parent.parent;
    }
    return false
  }

  function parseModifiers (name) {
    var match = name.match(modifierRE);
    if (match) {
      var ret = {};
      match.forEach(function (m) { ret[m.slice(1)] = true; });
      return ret
    }
  }

  function makeAttrsMap (attrs) {
    var map = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
      if (
        map[attrs[i].name] && !isIE && !isEdge
      ) {
        warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    return map
  }

  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag (el) {
    return el.tag === 'script' || el.tag === 'style'
  }

  function isForbiddenTag (el) {
    return (
      el.tag === 'style' ||
      (el.tag === 'script' && (
        !el.attrsMap.type ||
        el.attrsMap.type === 'text/javascript'
      ))
    )
  }

  var ieNSBug = /^xmlns:NS\d+/;
  var ieNSPrefix = /^NS\d+:/;

  /* istanbul ignore next */
  function guardIESVGBug (attrs) {
    var res = [];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, '');
        res.push(attr);
      }
    }
    return res
  }

  function checkForAliasModel (el, value) {
    var _el = el;
    while (_el) {
      if (_el.for && _el.alias === value) {
        warn$2(
          "<" + (el.tag) + " v-model=\"" + value + "\">: " +
          "You are binding v-model directly to a v-for iteration alias. " +
          "This will not be able to modify the v-for source array because " +
          "writing to the alias is like modifying a function local variable. " +
          "Consider using an array of objects and use v-model on an object property instead.",
          el.rawAttrsMap['v-model']
        );
      }
      _el = _el.parent;
    }
  }

  /*  */

  function preTransformNode (el, options) {
    if (el.tag === 'input') {
      var map = el.attrsMap;
      if (!map['v-model']) {
        return
      }

      var typeBinding;
      if (map[':type'] || map['v-bind:type']) {
        typeBinding = getBindingAttr(el, 'type');
      }
      if (!map.type && !typeBinding && map['v-bind']) {
        typeBinding = "(" + (map['v-bind']) + ").type";
      }

      if (typeBinding) {
        var ifCondition = getAndRemoveAttr(el, 'v-if', true);
        var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
        var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
        var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
        // 1. checkbox
        var branch0 = cloneASTElement(el);
        // process for on the main node
        processFor(branch0);
        addRawAttr(branch0, 'type', 'checkbox');
        processElement(branch0, options);
        branch0.processed = true; // prevent it from double-processed
        branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
        addIfCondition(branch0, {
          exp: branch0.if,
          block: branch0
        });
        // 2. add radio else-if condition
        var branch1 = cloneASTElement(el);
        getAndRemoveAttr(branch1, 'v-for', true);
        addRawAttr(branch1, 'type', 'radio');
        processElement(branch1, options);
        addIfCondition(branch0, {
          exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
          block: branch1
        });
        // 3. other
        var branch2 = cloneASTElement(el);
        getAndRemoveAttr(branch2, 'v-for', true);
        addRawAttr(branch2, ':type', typeBinding);
        processElement(branch2, options);
        addIfCondition(branch0, {
          exp: ifCondition,
          block: branch2
        });

        if (hasElse) {
          branch0.else = true;
        } else if (elseIfCondition) {
          branch0.elseif = elseIfCondition;
        }

        return branch0
      }
    }
  }

  function cloneASTElement (el) {
    return createASTElement(el.tag, el.attrsList.slice(), el.parent)
  }

  var model$1 = {
    preTransformNode: preTransformNode
  };

  var modules$1 = [
    klass$1,
    style$1,
    model$1
  ];

  /*  */

  function text (el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
    }
  }

  /*  */

  function html (el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
    }
  }

  var directives$1 = {
    model: model,
    text: text,
    html: html
  };

  /*  */

  var baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  };

  /*  */

  var isStaticKey;
  var isPlatformReservedTag;

  var genStaticKeysCached = cached(genStaticKeys$1);

  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize (root, options) {
    if (!root) { return }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1 (keys) {
    return makeMap(
      'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
      (keys ? ',' + keys : '')
    )
  }

  function markStatic$1 (node) {
    node.static = isStatic(node);
    if (node.type === 1) {
      // do not make component slot content static. this avoids
      // 1. components not able to mutate slot nodes
      // 2. static slot content fails for hot-reloading
      if (
        !isPlatformReservedTag(node.tag) &&
        node.tag !== 'slot' &&
        node.attrsMap['inline-template'] == null
      ) {
        return
      }
      for (var i = 0, l = node.children.length; i < l; i++) {
        var child = node.children[i];
        markStatic$1(child);
        if (!child.static) {
          node.static = false;
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          var block = node.ifConditions[i$1].block;
          markStatic$1(block);
          if (!block.static) {
            node.static = false;
          }
        }
      }
    }
  }

  function markStaticRoots (node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) {
        node.staticInFor = isInFor;
      }
      // For a node to qualify as a static root, it should have children that
      // are not just static text. Otherwise the cost of hoisting out will
      // outweigh the benefits and it's better off to just always render it fresh.
      if (node.static && node.children.length && !(
        node.children.length === 1 &&
        node.children[0].type === 3
      )) {
        node.staticRoot = true;
        return
      } else {
        node.staticRoot = false;
      }
      if (node.children) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], isInFor || !!node.for);
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          markStaticRoots(node.ifConditions[i$1].block, isInFor);
        }
      }
    }
  }

  function isStatic (node) {
    if (node.type === 2) { // expression
      return false
    }
    if (node.type === 3) { // text
      return true
    }
    return !!(node.pre || (
      !node.hasBindings && // no dynamic bindings
      !node.if && !node.for && // not v-if or v-for or v-else
      !isBuiltInTag(node.tag) && // not a built-in
      isPlatformReservedTag(node.tag) && // not a component
      !isDirectChildOfTemplateFor(node) &&
      Object.keys(node).every(isStaticKey)
    ))
  }

  function isDirectChildOfTemplateFor (node) {
    while (node.parent) {
      node = node.parent;
      if (node.tag !== 'template') {
        return false
      }
      if (node.for) {
        return true
      }
    }
    return false
  }

  /*  */

  var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*(?:[\w$]+)?\s*\(/;
  var fnInvokeRE = /\([^)]*?\);*$/;
  var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

  // KeyboardEvent.keyCode aliases
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  };

  // KeyboardEvent.key aliases
  var keyNames = {
    // #7880: IE11 and Edge use `Esc` for Escape key name.
    esc: ['Esc', 'Escape'],
    tab: 'Tab',
    enter: 'Enter',
    // #9112: IE11 uses `Spacebar` for Space key name.
    space: [' ', 'Spacebar'],
    // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
    up: ['Up', 'ArrowUp'],
    left: ['Left', 'ArrowLeft'],
    right: ['Right', 'ArrowRight'],
    down: ['Down', 'ArrowDown'],
    // #9112: IE11 uses `Del` for Delete key name.
    'delete': ['Backspace', 'Delete', 'Del']
  };

  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

  var modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard("$event.target !== $event.currentTarget"),
    ctrl: genGuard("!$event.ctrlKey"),
    shift: genGuard("!$event.shiftKey"),
    alt: genGuard("!$event.altKey"),
    meta: genGuard("!$event.metaKey"),
    left: genGuard("'button' in $event && $event.button !== 0"),
    middle: genGuard("'button' in $event && $event.button !== 1"),
    right: genGuard("'button' in $event && $event.button !== 2")
  };

  function genHandlers (
    events,
    isNative
  ) {
    var prefix = isNative ? 'nativeOn:' : 'on:';
    var staticHandlers = "";
    var dynamicHandlers = "";
    for (var name in events) {
      var handlerCode = genHandler(events[name]);
      if (events[name] && events[name].dynamic) {
        dynamicHandlers += name + "," + handlerCode + ",";
      } else {
        staticHandlers += "\"" + name + "\":" + handlerCode + ",";
      }
    }
    staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
    if (dynamicHandlers) {
      return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
    } else {
      return prefix + staticHandlers
    }
  }

  function genHandler (handler) {
    if (!handler) {
      return 'function(){}'
    }

    if (Array.isArray(handler)) {
      return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
    }

    var isMethodPath = simplePathRE.test(handler.value);
    var isFunctionExpression = fnExpRE.test(handler.value);
    var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

    if (!handler.modifiers) {
      if (isMethodPath || isFunctionExpression) {
        return handler.value
      }
      return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
    } else {
      var code = '';
      var genModifierCode = '';
      var keys = [];
      for (var key in handler.modifiers) {
        if (modifierCode[key]) {
          genModifierCode += modifierCode[key];
          // left/right
          if (keyCodes[key]) {
            keys.push(key);
          }
        } else if (key === 'exact') {
          var modifiers = (handler.modifiers);
          genModifierCode += genGuard(
            ['ctrl', 'shift', 'alt', 'meta']
              .filter(function (keyModifier) { return !modifiers[keyModifier]; })
              .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
              .join('||')
          );
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code += genKeyFilter(keys);
      }
      // Make sure modifiers like prevent and stop get executed after key filtering
      if (genModifierCode) {
        code += genModifierCode;
      }
      var handlerCode = isMethodPath
        ? ("return " + (handler.value) + "($event)")
        : isFunctionExpression
          ? ("return (" + (handler.value) + ")($event)")
          : isFunctionInvocation
            ? ("return " + (handler.value))
            : handler.value;
      return ("function($event){" + code + handlerCode + "}")
    }
  }

  function genKeyFilter (keys) {
    return (
      // make sure the key filters only apply to KeyboardEvents
      // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
      // key events that do not have keyCode property...
      "if(!$event.type.indexOf('key')&&" +
      (keys.map(genFilterCode).join('&&')) + ")return null;"
    )
  }

  function genFilterCode (key) {
    var keyVal = parseInt(key, 10);
    if (keyVal) {
      return ("$event.keyCode!==" + keyVal)
    }
    var keyCode = keyCodes[key];
    var keyName = keyNames[key];
    return (
      "_k($event.keyCode," +
      (JSON.stringify(key)) + "," +
      (JSON.stringify(keyCode)) + "," +
      "$event.key," +
      "" + (JSON.stringify(keyName)) +
      ")"
    )
  }

  /*  */

  function on (el, dir) {
    if (dir.modifiers) {
      warn("v-on without argument does not support modifiers.");
    }
    el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
  }

  /*  */

  function bind$1 (el, dir) {
    el.wrapData = function (code) {
      return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
    };
  }

  /*  */

  var baseDirectives = {
    on: on,
    bind: bind$1,
    cloak: noop
  };

  /*  */





  var CodegenState = function CodegenState (options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend(extend({}, baseDirectives), options.directives);
    var isReservedTag = options.isReservedTag || no;
    this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
    this.onceId = 0;
    this.staticRenderFns = [];
    this.pre = false;
  };



  function generate (
    ast,
    options
  ) {
    var state = new CodegenState(options);
    var code = ast ? genElement(ast, state) : '_c("div")';
    return {
      render: ("with(this){return " + code + "}"),
      staticRenderFns: state.staticRenderFns
    }
  }

  function genElement (el, state) {
    if (el.parent) {
      el.pre = el.pre || el.parent.pre;
    }

    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state)
    } else if (el.for && !el.forProcessed) {
      return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
      return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
      return genSlot(el, state)
    } else {
      // component or element
      var code;
      if (el.component) {
        code = genComponent(el.component, el, state);
      } else {
        var data;
        if (!el.plain || (el.pre && state.maybeComponent(el))) {
          data = genData$2(el, state);
        }

        var children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
      }
      // module transforms
      for (var i = 0; i < state.transforms.length; i++) {
        code = state.transforms[i](el, code);
      }
      return code
    }
  }

  // hoist static sub-trees out
  function genStatic (el, state) {
    el.staticProcessed = true;
    // Some elements (templates) need to behave differently inside of a v-pre
    // node.  All pre nodes are static roots, so we can use this as a location to
    // wrap a state change and reset it upon exiting the pre node.
    var originalPreState = state.pre;
    if (el.pre) {
      state.pre = el.pre;
    }
    state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
    state.pre = originalPreState;
    return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
  }

  // v-once
  function genOnce (el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.staticInFor) {
      var key = '';
      var parent = el.parent;
      while (parent) {
        if (parent.for) {
          key = parent.key;
          break
        }
        parent = parent.parent;
      }
      if (!key) {
        state.warn(
          "v-once can only be used inside v-for that is keyed. ",
          el.rawAttrsMap['v-once']
        );
        return genElement(el, state)
      }
      return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
    } else {
      return genStatic(el, state)
    }
  }

  function genIf (
    el,
    state,
    altGen,
    altEmpty
  ) {
    el.ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
  }

  function genIfConditions (
    conditions,
    state,
    altGen,
    altEmpty
  ) {
    if (!conditions.length) {
      return altEmpty || '_e()'
    }

    var condition = conditions.shift();
    if (condition.exp) {
      return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
    } else {
      return ("" + (genTernaryExp(condition.block)))
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp (el) {
      return altGen
        ? altGen(el, state)
        : el.once
          ? genOnce(el, state)
          : genElement(el, state)
    }
  }

  function genFor (
    el,
    state,
    altGen,
    altHelper
  ) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
    var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

    if (state.maybeComponent(el) &&
      el.tag !== 'slot' &&
      el.tag !== 'template' &&
      !el.key
    ) {
      state.warn(
        "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
        "v-for should have explicit keys. " +
        "See https://vuejs.org/guide/list.html#key for more info.",
        el.rawAttrsMap['v-for'],
        true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    return (altHelper || '_l') + "((" + exp + ")," +
      "function(" + alias + iterator1 + iterator2 + "){" +
        "return " + ((altGen || genElement)(el, state)) +
      '})'
  }

  function genData$2 (el, state) {
    var data = '{';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    var dirs = genDirectives(el, state);
    if (dirs) { data += dirs + ','; }

    // key
    if (el.key) {
      data += "key:" + (el.key) + ",";
    }
    // ref
    if (el.ref) {
      data += "ref:" + (el.ref) + ",";
    }
    if (el.refInFor) {
      data += "refInFor:true,";
    }
    // pre
    if (el.pre) {
      data += "pre:true,";
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
      data += "tag:\"" + (el.tag) + "\",";
    }
    // module data generation functions
    for (var i = 0; i < state.dataGenFns.length; i++) {
      data += state.dataGenFns[i](el);
    }
    // attributes
    if (el.attrs) {
      data += "attrs:" + (genProps(el.attrs)) + ",";
    }
    // DOM props
    if (el.props) {
      data += "domProps:" + (genProps(el.props)) + ",";
    }
    // event handlers
    if (el.events) {
      data += (genHandlers(el.events, false)) + ",";
    }
    if (el.nativeEvents) {
      data += (genHandlers(el.nativeEvents, true)) + ",";
    }
    // slot target
    // only for non-scoped slots
    if (el.slotTarget && !el.slotScope) {
      data += "slot:" + (el.slotTarget) + ",";
    }
    // scoped slots
    if (el.scopedSlots) {
      data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
    }
    // component v-model
    if (el.model) {
      data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
    }
    // inline-template
    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el, state);
      if (inlineTemplate) {
        data += inlineTemplate + ",";
      }
    }
    data = data.replace(/,$/, '') + '}';
    // v-bind dynamic argument wrap
    // v-bind with dynamic arguments must be applied using the same v-bind object
    // merge helper so that class/style/mustUseProp attrs are handled correctly.
    if (el.dynamicAttrs) {
      data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
    }
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    // v-on data wrap
    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }
    return data
  }

  function genDirectives (el, state) {
    var dirs = el.directives;
    if (!dirs) { return }
    var res = 'directives:[';
    var hasRuntime = false;
    var i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = state.directives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, state.warn);
      }
      if (needRuntime) {
        hasRuntime = true;
        res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + ']'
    }
  }

  function genInlineTemplate (el, state) {
    var ast = el.children[0];
    if (el.children.length !== 1 || ast.type !== 1) {
      state.warn(
        'Inline-template components must have exactly one child element.',
        { start: el.start }
      );
    }
    if (ast && ast.type === 1) {
      var inlineRenderFns = generate(ast, state.options);
      return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
    }
  }

  function genScopedSlots (
    el,
    slots,
    state
  ) {
    // by default scoped slots are considered "stable", this allows child
    // components with only scoped slots to skip forced updates from parent.
    // but in some cases we have to bail-out of this optimization
    // for example if the slot contains dynamic names, has v-if or v-for on them...
    var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
      var slot = slots[key];
      return (
        slot.slotTargetDynamic ||
        slot.if ||
        slot.for ||
        containsSlotChild(slot) // is passing down slot from parent which may be dynamic
      )
    });

    // #9534: if a component with scoped slots is inside a conditional branch,
    // it's possible for the same component to be reused but with different
    // compiled slot content. To avoid that, we generate a unique key based on
    // the generated code of all the slot contents.
    var needsKey = !!el.if;

    // OR when it is inside another scoped slot or v-for (the reactivity may be
    // disconnected due to the intermediate scope variable)
    // #9438, #9506
    // TODO: this can be further optimized by properly analyzing in-scope bindings
    // and skip force updating ones that do not actually use scope variables.
    if (!needsForceUpdate) {
      var parent = el.parent;
      while (parent) {
        if (
          (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
          parent.for
        ) {
          needsForceUpdate = true;
          break
        }
        if (parent.if) {
          needsKey = true;
        }
        parent = parent.parent;
      }
    }

    var generatedSlots = Object.keys(slots)
      .map(function (key) { return genScopedSlot(slots[key], state); })
      .join(',');

    return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
  }

  function hash(str) {
    var hash = 5381;
    var i = str.length;
    while(i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0
  }

  function containsSlotChild (el) {
    if (el.type === 1) {
      if (el.tag === 'slot') {
        return true
      }
      return el.children.some(containsSlotChild)
    }
    return false
  }

  function genScopedSlot (
    el,
    state
  ) {
    var isLegacySyntax = el.attrsMap['slot-scope'];
    if (el.if && !el.ifProcessed && !isLegacySyntax) {
      return genIf(el, state, genScopedSlot, "null")
    }
    if (el.for && !el.forProcessed) {
      return genFor(el, state, genScopedSlot)
    }
    var slotScope = el.slotScope === emptySlotScopeToken
      ? ""
      : String(el.slotScope);
    var fn = "function(" + slotScope + "){" +
      "return " + (el.tag === 'template'
        ? el.if && isLegacySyntax
          ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
          : genChildren(el, state) || 'undefined'
        : genElement(el, state)) + "}";
    // reverse proxy v-slot without scope on this.$slots
    var reverseProxy = slotScope ? "" : ",proxy:true";
    return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
  }

  function genChildren (
    el,
    state,
    checkSkip,
    altGenElement,
    altGenNode
  ) {
    var children = el.children;
    if (children.length) {
      var el$1 = children[0];
      // optimize single v-for
      if (children.length === 1 &&
        el$1.for &&
        el$1.tag !== 'template' &&
        el$1.tag !== 'slot'
      ) {
        var normalizationType = checkSkip
          ? state.maybeComponent(el$1) ? ",1" : ",0"
          : "";
        return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
      }
      var normalizationType$1 = checkSkip
        ? getNormalizationType(children, state.maybeComponent)
        : 0;
      var gen = altGenNode || genNode;
      return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
    }
  }

  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType (
    children,
    maybeComponent
  ) {
    var res = 0;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el.type !== 1) {
        continue
      }
      if (needsNormalization(el) ||
          (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
        res = 2;
        break
      }
      if (maybeComponent(el) ||
          (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
        res = 1;
      }
    }
    return res
  }

  function needsNormalization (el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
  }

  function genNode (node, state) {
    if (node.type === 1) {
      return genElement(node, state)
    } else if (node.type === 3 && node.isComment) {
      return genComment(node)
    } else {
      return genText(node)
    }
  }

  function genText (text) {
    return ("_v(" + (text.type === 2
      ? text.expression // no need for () because already wrapped in _s()
      : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
  }

  function genComment (comment) {
    return ("_e(" + (JSON.stringify(comment.text)) + ")")
  }

  function genSlot (el, state) {
    var slotName = el.slotName || '"default"';
    var children = genChildren(el, state);
    var res = "_t(" + slotName + (children ? ("," + children) : '');
    var attrs = el.attrs || el.dynamicAttrs
      ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
          // slot props are camelized
          name: camelize(attr.name),
          value: attr.value,
          dynamic: attr.dynamic
        }); }))
      : null;
    var bind$$1 = el.attrsMap['v-bind'];
    if ((attrs || bind$$1) && !children) {
      res += ",null";
    }
    if (attrs) {
      res += "," + attrs;
    }
    if (bind$$1) {
      res += (attrs ? '' : ',null') + "," + bind$$1;
    }
    return res + ')'
  }

  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent (
    componentName,
    el,
    state
  ) {
    var children = el.inlineTemplate ? null : genChildren(el, state, true);
    return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
  }

  function genProps (props) {
    var staticProps = "";
    var dynamicProps = "";
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var value = transformSpecialNewlines(prop.value);
      if (prop.dynamic) {
        dynamicProps += (prop.name) + "," + value + ",";
      } else {
        staticProps += "\"" + (prop.name) + "\":" + value + ",";
      }
    }
    staticProps = "{" + (staticProps.slice(0, -1)) + "}";
    if (dynamicProps) {
      return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
    } else {
      return staticProps
    }
  }

  // #3895, #4268
  function transformSpecialNewlines (text) {
    return text
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  }

  /*  */



  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp('\\b' + (
    'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
    'super,throw,while,yield,delete,export,import,return,switch,default,' +
    'extends,finally,continue,debugger,function,arguments'
  ).split(',').join('\\b|\\b') + '\\b');

  // these unary operators should not be used as property/method names
  var unaryOperatorsRE = new RegExp('\\b' + (
    'delete,typeof,void'
  ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

  // strip strings in expressions
  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template
  function detectErrors (ast, warn) {
    if (ast) {
      checkNode(ast, warn);
    }
  }

  function checkNode (node, warn) {
    if (node.type === 1) {
      for (var name in node.attrsMap) {
        if (dirRE.test(name)) {
          var value = node.attrsMap[name];
          if (value) {
            var range = node.rawAttrsMap[name];
            if (name === 'v-for') {
              checkFor(node, ("v-for=\"" + value + "\""), warn, range);
            } else if (onRE.test(name)) {
              checkEvent(value, (name + "=\"" + value + "\""), warn, range);
            } else {
              checkExpression(value, (name + "=\"" + value + "\""), warn, range);
            }
          }
        }
      }
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          checkNode(node.children[i], warn);
        }
      }
    } else if (node.type === 2) {
      checkExpression(node.expression, node.text, warn, node);
    }
  }

  function checkEvent (exp, text, warn, range) {
    var stipped = exp.replace(stripStringRE, '');
    var keywordMatch = stipped.match(unaryOperatorsRE);
    if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
      warn(
        "avoid using JavaScript unary operator as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
        range
      );
    }
    checkExpression(exp, text, warn, range);
  }

  function checkFor (node, text, warn, range) {
    checkExpression(node.for || '', text, warn, range);
    checkIdentifier(node.alias, 'v-for alias', text, warn, range);
    checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
    checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
  }

  function checkIdentifier (
    ident,
    type,
    text,
    warn,
    range
  ) {
    if (typeof ident === 'string') {
      try {
        new Function(("var " + ident + "=_"));
      } catch (e) {
        warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
      }
    }
  }

  function checkExpression (exp, text, warn, range) {
    try {
      new Function(("return " + exp));
    } catch (e) {
      var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
      if (keywordMatch) {
        warn(
          "avoid using JavaScript keyword as property name: " +
          "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
          range
        );
      } else {
        warn(
          "invalid expression: " + (e.message) + " in\n\n" +
          "    " + exp + "\n\n" +
          "  Raw expression: " + (text.trim()) + "\n",
          range
        );
      }
    }
  }

  /*  */

  var range = 2;

  function generateCodeFrame (
    source,
    start,
    end
  ) {
    if ( start === void 0 ) start = 0;
    if ( end === void 0 ) end = source.length;

    var lines = source.split(/\r?\n/);
    var count = 0;
    var res = [];
    for (var i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count >= start) {
        for (var j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length) { continue }
          res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
          var lineLength = lines[j].length;
          if (j === i) {
            // push underline
            var pad = start - (count - lineLength) + 1;
            var length = end > count ? lineLength - pad : end - start;
            res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
          } else if (j > i) {
            if (end > count) {
              var length$1 = Math.min(end - count, lineLength);
              res.push("   |  " + repeat$1("^", length$1));
            }
            count += lineLength + 1;
          }
        }
        break
      }
    }
    return res.join('\n')
  }

  function repeat$1 (str, n) {
    var result = '';
    if (n > 0) {
      while (true) { // eslint-disable-line
        if (n & 1) { result += str; }
        n >>>= 1;
        if (n <= 0) { break }
        str += str;
      }
    }
    return result
  }

  /*  */



  function createFunction (code, errors) {
    try {
      return new Function(code)
    } catch (err) {
      errors.push({ err: err, code: code });
      return noop
    }
  }

  function createCompileToFunctionFn (compile) {
    var cache = Object.create(null);

    return function compileToFunctions (
      template,
      options,
      vm
    ) {
      options = extend({}, options);
      var warn$$1 = options.warn || warn;
      delete options.warn;

      /* istanbul ignore if */
      {
        // detect possible CSP restriction
        try {
          new Function('return 1');
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            warn$$1(
              'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
            );
          }
        }
      }

      // check cache
      var key = options.delimiters
        ? String(options.delimiters) + template
        : template;
      if (cache[key]) {
        return cache[key]
      }

      // compile
      var compiled = compile(template, options);

      // check compilation errors/tips
      {
        if (compiled.errors && compiled.errors.length) {
          if (options.outputSourceRange) {
            compiled.errors.forEach(function (e) {
              warn$$1(
                "Error compiling template:\n\n" + (e.msg) + "\n\n" +
                generateCodeFrame(template, e.start, e.end),
                vm
              );
            });
          } else {
            warn$$1(
              "Error compiling template:\n\n" + template + "\n\n" +
              compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
              vm
            );
          }
        }
        if (compiled.tips && compiled.tips.length) {
          if (options.outputSourceRange) {
            compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
          } else {
            compiled.tips.forEach(function (msg) { return tip(msg, vm); });
          }
        }
      }

      // turn code into functions
      var res = {};
      var fnGenErrors = [];
      res.render = createFunction(compiled.render, fnGenErrors);
      res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
        return createFunction(code, fnGenErrors)
      });

      // check function generation errors.
      // this should only happen if there is a bug in the compiler itself.
      // mostly for codegen development use
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
          warn$$1(
            "Failed to generate render function:\n\n" +
            fnGenErrors.map(function (ref) {
              var err = ref.err;
              var code = ref.code;

              return ((err.toString()) + " in\n\n" + code + "\n");
          }).join('\n'),
            vm
          );
        }
      }

      return (cache[key] = res)
    }
  }

  /*  */

  function createCompilerCreator (baseCompile) {
    return function createCompiler (baseOptions) {
      function compile (
        template,
        options
      ) {
        var finalOptions = Object.create(baseOptions);
        var errors = [];
        var tips = [];

        var warn = function (msg, range, tip) {
          (tip ? tips : errors).push(msg);
        };

        if (options) {
          if (options.outputSourceRange) {
            // $flow-disable-line
            var leadingSpaceLength = template.match(/^\s*/)[0].length;

            warn = function (msg, range, tip) {
              var data = { msg: msg };
              if (range) {
                if (range.start != null) {
                  data.start = range.start + leadingSpaceLength;
                }
                if (range.end != null) {
                  data.end = range.end + leadingSpaceLength;
                }
              }
              (tip ? tips : errors).push(data);
            };
          }
          // merge custom modules
          if (options.modules) {
            finalOptions.modules =
              (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives
          if (options.directives) {
            finalOptions.directives = extend(
              Object.create(baseOptions.directives || null),
              options.directives
            );
          }
          // copy other options
          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        finalOptions.warn = warn;

        var compiled = baseCompile(template.trim(), finalOptions);
        {
          detectErrors(compiled.ast, warn);
        }
        compiled.errors = errors;
        compiled.tips = tips;
        return compiled
      }

      return {
        compile: compile,
        compileToFunctions: createCompileToFunctionFn(compile)
      }
    }
  }

  /*  */

  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  var createCompiler = createCompilerCreator(function baseCompile (
    template,
    options
  ) {
    var ast = parse(template.trim(), options);
    if (options.optimize !== false) {
      optimize(ast, options);
    }
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  });

  /*  */

  var ref$1 = createCompiler(baseOptions);
  var compile = ref$1.compile;
  var compileToFunctions = ref$1.compileToFunctions;

  /*  */

  // check whether current browser encodes a char inside attribute values
  var div;
  function getShouldDecode (href) {
    div = div || document.createElement('div');
    div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
    return div.innerHTML.indexOf('&#10;') > 0
  }

  // #3663: IE encodes newlines inside attribute values while other browsers don't
  var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
  // #6828: chrome encodes content in a[href]
  var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

  /*  */

  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML
  });

  var mount = Vue.prototype.$mount;
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && query(el);

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
      warn(
        "Do not mount Vue to <html> or <body> - mount to normal elements instead."
      );
      return this
    }

    var options = this.$options;
    // resolve template/el and convert to render function
    if (!options.render) {
      var template = options.template;
      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template);
            /* istanbul ignore if */
            if (!template) {
              warn(
                ("Template element not found or is empty: " + (options.template)),
                this
              );
            }
          }
        } else if (template.nodeType) {
          template = template.innerHTML;
        } else {
          {
            warn('invalid template option:' + template, this);
          }
          return this
        }
      } else if (el) {
        template = getOuterHTML(el);
      }
      if (template) {
        /* istanbul ignore if */
        if (config.performance && mark) {
          mark('compile');
        }

        var ref = compileToFunctions(template, {
          outputSourceRange: "development" !== 'production',
          shouldDecodeNewlines: shouldDecodeNewlines,
          shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        }, this);
        var render = ref.render;
        var staticRenderFns = ref.staticRenderFns;
        options.render = render;
        options.staticRenderFns = staticRenderFns;

        /* istanbul ignore if */
        if (config.performance && mark) {
          mark('compile end');
          measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
        }
      }
    }
    return mount.call(this, el, hydrating)
  };

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */
  function getOuterHTML (el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML
    }
  }

  Vue.compile = compileToFunctions;

  return Vue;

}));