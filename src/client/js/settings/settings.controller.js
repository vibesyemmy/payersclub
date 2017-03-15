class SettingsCtrl {
  constructor(User, $state) {
    'ngInject';

    this._User = User;
    this._$state = $state;

    this.formData = {
      email: User.current.email,
      username: User.current.username,
      phone: User.current.phone,
      bk_name: User.current.bk_name,
      bkaccount_name: User.current.bkaccount_name,
      bkaccount_number: User.current.bkaccount_number,
      plan:User.current.plan
    }

    this.logout = User.logout.bind(User);

  }

  submitForm() {
    this.isSubmitting = true;
    this._User.update(this.formData).then(
      (user) => {
        this._$state.go('app.home')
      },
      (err) => {
        this.isSubmitting = false;
        this.errors = err.data.errors;
      }
    )
  }

}

export default SettingsCtrl;
