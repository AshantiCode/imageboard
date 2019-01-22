(function() {
  new Vue({
    el: '#main',
    data: {
      title: 'Whatever Images',
      results: [],
      form: {
        title: '',
        name: '',
        description: '',
        file: null
      }
    },
    mounted: function() {
      axios.get('/images').then(
        function(res) {
          this.results = res.data.rows;
        }.bind(this)
      );
    },
    methods: {
      uploadFile: function(e) {
        e.preventDefault(); //button does not reload anymore
        console.console.log('this: ', this;);
         //it refers to my vue instance
        console.log('only the description:', this.form.description);
        var file = getElementById('file');
        var uploadedFile = file.files[0];
        //now we want to prepate the files by using API Form Data to then send them the server with axious.
        var formData = new FormData();
        formData.append('file', uploadedFile);
        console.log('formData: ', formData);
        formData.append('title', this.form.title);
        formData.append('name', this.form.name);
        formData.append('description', this.form.description);

        axios.post('/upload', formData).then(function() {});
      }
    }
  });
})();
