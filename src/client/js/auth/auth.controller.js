/*jshint esversion: 6 */
class AuthCtrl {
  constructor(User, $state) {
    'ngInject';

    this._User = User;
    this._$state = $state;

    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');
    this.alert    = {};
    this.alert.show = false;

  }

  closeAlert() {
    this.alert    = {};
    this.alert.show = false;
  }

  submitForm() {
    this.isSubmitting = true;
    this.formData.username = this.formData.username.toLowerCase(); 
    this._User.attemptAuth(this.authType, this.formData, this.plan).then(
      (res) => {
        // this._$state.go('dash', null, { reload: true });
        window.location = "/";
      },
      (err) => {
        console.log(err);
        this.isSubmitting = false;
        this.alert.type = "danger";
        this.alert.msg = err.data.error;
        this.alert.show = true;
        this.errors = err.data.errors;
      }
    );
  }
}

export default AuthCtrl;
