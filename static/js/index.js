var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        show: true,
        hide: false
    }
});

var app2 = new Vue({
    el: '#app2',
    data: {
        message: '页面加载' + new Date().toLocaleString()
    }
});

var app3 = new Vue({
    el: '#app3',
    data: {
        seen: true,
        see: false
    }
});

var app4 = new Vue({
    el: '#app4',
    data: {
        todos: [{
                text: '学习 JavaScript'
            },
            {
                text: '学习 Vue'
            },
            {
                text: '整个牛项目'
            }
        ]
    }
});

var app5 = new Vue({
    el: '#app5',
    data: {
        message: 'Hello Vue.js!'
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        }
    }
})

var app6 = new Vue({
    el: '#app6',
    data: {
        message: 'Hello Vue!'
    }
})

Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
    el: '#app7',
    data: {
        groceryList: [{
                id: 0,
                text: '蔬菜'
            },
            {
                id: 1,
                text: '奶酪'
            },
            {
                id: 2,
                text: '随便其它什么人吃的东西'
            }
        ]
    }
})

var app7 = new Vue({
    data: {
        a: 1
    },
    created: function (param) {
        // var self = this;
        console.log('a is:' + this.a);
    },
})


var app8 = new Vue({
    el: '#app8',
    data: {
        href: 'www.baidu.com',
        url: 'www.baidu.com',
        // someAttr: value,
        value: 'demo'
    },
    methods: {
        demo: function (param) {
            alert('这是点击');
        }
    }
})


var app9 = new Vue({
    el: '#app9',
    data: {
        message: 'hello world!'
    }
})

var app10 = new Vue({
    el: '#app10',
    data: {
        message: 'hello world!'
    },
    // computed: {
    //     // 相当于python的 getattr 缓存
    //     reversedMessage: function () {
    //         return this.message.split('').reverse().join('');

    //     }
    // },
    // 在组件中 和上边一样的效果 每次都执行 不缓存
    // methods: {
    //     reversedMessage: function () {
    //     return this.message.split('').reverse().join('')
    //     }
    // }

    // computed: {
    //     now: function () {
    //       return Date.now()
    //     }
    //   }

    // methods: {
    //     now: function () {
    //         return Date.now()
    //     }
    // }
})
// console.log(app10.reversedMessage); // !dlrow olleh

var app11 = new Vue({
    el: '#app11',
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        // fullName: 'Foo Bar'
    },
    // watch: {
    //     firstName: function (val) { 
    //         this.firstName = val + ' ' + this.lastName
    //      },
    //      lastName: function (val) { 
    //          this.fullName = this.firstName + ' ' + val
    //       }
    // },
    computed: {
        // fullName: function () {
        //     return this.firstName + ' ' + this.lastName
        // }
        fullName: {
            get: function (param) {
                return this.firstName + ' ' + this.lastName
            },
            set: function (newValue) {
                var names = newValue.split(' ')
                this.firstName = names[0]
                this.lastName = names[names.length - 1]
            }
        }
    },
})
app11.fullName = 'hao ge'
// Foo Bar

var app12 = new Vue({
    el: '#app12',
    data: {
        question: '',
        answer: 'I cannot give you an answer until you ask a question!'
    },
    watch: {
        // 如果 `question` 发生改变，这个函数就会运行
        question: function (newQuestion, oldQuestion) {
            this.answer = 'Waiting for you to stop typing...'
            this.debouncedGetAnswer()
        }
    },
    created: function () {
        // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
        // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
        // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
        // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
        // 请参考：https://lodash.com/docs#debounce
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
    },
    methods: {
        getAnswer: function () {
            if (this.question.indexOf('?') === -1) {
                this.answer = 'Questions usually contain a question mark. ;-)'
                return
            }
            this.answer = 'Thinking...'
            var vm = this
            axios.get('https://yesno.wtf/api')
                .then(function (response) {
                    vm.answer = _.capitalize(response.data.answer)
                })
                .catch(function (error) {
                    vm.answer = 'Error! Could not reach the API. ' + error
                })
        }
    }
})

var user = new Vue({
    data: {
        userProfile: {
            name: 'haoge'
        }
    }
})

// 设置属性值1
Vue.set(user.userProfile, 'age', 28)
console.log(user.userProfile.name); // haoge
console.log(user.userProfile.age); // 28
// 设置属性值2
user.userProfile = Object.assign({}, user.userProfile, {
    high: 180,
    school: '蚌埠'
})
console.log(user.userProfile.school); // 蚌埠

// v-for 
var app13 = new Vue({
    el: "#app13",
    data: {
        numbers: [1, 2, 3, 4, 5]
    },
    computed: {
        evenNumbers: function (param) { 
            return this.numbers.filter(function (number) { 
                return number % 2 === 0
             })
         }
    }, // 2 4
    methods: {
        even: function (numbers) { 
            return numbers.filter(function (number) { 
                return number % 2 === 0
             })
         }
    } // 2 4
}) 

Vue.component('todo-item', {
    template: '\
      <li>\
        {{ title }}\
        <button v-on:click="$emit(\'remove\')">Remove</button>\
      </li>\
    ',
    props: ['title']
  })
  
  new Vue({
    el: '#app14',
    data: {
      newTodoText: '',
      todos: [
        {
          id: 1,
          title: 'Do the dishes',
        },
        {
          id: 2,
          title: 'Take out the trash',
        },
        {
          id: 3,
          title: 'Mow the lawn'
        }
      ],
      nextTodoId: 4
    },
    methods: {
      addNewTodo: function () {
        this.todos.push({
          id: this.nextTodoId++,
          title: this.newTodoText
        })
        this.newTodoText = ''
      }
    }
  })

