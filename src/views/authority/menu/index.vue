<template>
  <div>
    <Tree :data="data4" show-checkbox multiple @on-check-change="changeCheck" @on-select-change="changeSelect"></Tree>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        data4: [{
          title: "parent 1",
          expand: true,
          selected: true,
          children: [{
              title: "parent 1-1",
              expand: true,
              children: [{
                  title: "leaf 1-1-1",
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [{
                  title: "leaf 1-2-1",
                  checked: true
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }]
      };
    },
    methods: {
      getList() {
        this.$http.post(this.api.findMenuList).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
          }
        });
      },
      changeCheck(data) {
        console.log(data)
      },
      changeSelect(data) {
        console.log(data)
      }
    },
    created() {
      // this.getList();
      this.data4.map((el, index) => {
        console.log(el.title)
      })
    }
  };
</script>

<style lang='less' scoped>
  
</style>