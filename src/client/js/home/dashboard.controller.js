/*jshint esversion: 6 */
class DashCtrl{
	constructor(ph, gh, user, $scope, SocketIO, UploadService){
		'ngInject';

		this.ph 			= ph;
		this.pair 		= gh;
		this.user			= user;
		this._$scope 	= $scope;
		this.up 			= UploadService;
		this.io 			= SocketIO;

		this.init()
	}

	init() {
		let u = {
			id: this.user.objectId,
			username: this.user.username
		};

		this.io.on('connect', (s)=> {
			this.io.emit('new_user', u);

			this.io.on('get_news', (news) =>{
				console.log(news);
			});
		});

		this.io.on('disconnect', ()=>{
			this.io.emit('bye', u);
		});
	}
}

export default DashCtrl;