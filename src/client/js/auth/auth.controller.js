/*jshint esversion: 6 */
class AuthCtrl {
  constructor(User, $state) {
    'ngInject';

    this._User = User;
    this._$state = $state;

    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');

  }

  submitForm() {
    this.isSubmitting = true;
    this.formData.username = this.formData.username.toLowerCase(); 
    this._User.attemptAuth(this.authType, this.formData, this.plan).then(
      (res) => {
        this._$state.go('app.dash', null, { reload: true });
      },
      (err) => {
        console.log(err);
        this.isSubmitting = false;
        this.errors = err.data.errors;
      }
    );
  }
}

export default AuthCtrl;
