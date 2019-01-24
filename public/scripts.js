new Vue({
  el: '#main',
  data: {
    imageId: null,
    images: [],
    form: {
      title: '',
      username: '',
      description: '',
      file: null
    }
  },
  mounted: function() {
    var self = this;
    console.log('I mounted!');
    axios.get('/images').then(function(res) {
      console.log('res.data:', res.data);
      self.images = res.data;
    });
  },
  methods: {
    getId: function(imageId) {
      console.log('getting ID!!!!!: ', imageId);
      this.imageId = imageId;
    },
    closeModal: function() {
      console.log('CLicked on Modal!!!!');
      this.imageId = null;
    },

    uploadFile: function(e) {
      e.preventDefault(); //button does not reload page anymore
      console.log('this: ', this);
      //it refers to my vue instance
      console.log('only the description:', this.form.description);
      var file = document.getElementById('file');
      var uploadedFile = file.files[0];
      //now we want to prepate the files by using API Form Data to then send them to the server with axious.
      var formData = new FormData();
      formData.append('file', uploadedFile);
      console.log('formData: ', formData);
      formData.append('title', this.form.title);
      formData.append('description', this.form.description);
      formData.append('username', this.form.username);

      let self = this;

      axios
        .post('/upload', formData)
        .then(function(res) {
          self.images.unshift(res.data);
        })
        .catch(err => {
          console.log('Error in uploadFile: ', err);
        });
    } //closes uploadFile
  } //closes methods
}); // closes Vue instance

Vue.component('image-modal', {
  data: function() {
    return {
      image: {
        title: '',
        description: '',
        username: '',
        url: ''
      }
    };
  },
  props: ['id'],

  mounted: function() {
    console.log('Image modal has mounted');
  },
  methods: {
    closeModal1: function() {
      console.log('CLicked on Modal!!!!');
      this.$emit('close');
    }
  },

  template: '#image-modal'
}); //closing component
