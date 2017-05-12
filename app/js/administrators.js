ra.factory('Administrators', function ($firebaseAuth) {
    var administrators = [];
    administrators.push('njenan@gmail.com');
    administrators.push('olegspace@gmail.com');
    administrators.push('achautard@gmail.com');
    administrators.push('kylesiler@gmail.com');

    var firebaseUser;

    $firebaseAuth().$onAuthStateChanged(function (nextState) {
        firebaseUser = nextState;
    });

    return {
        isAdminUser: function () {
            console.log('checking admin status of ', firebaseUser);
            var isAdmin = firebaseUser && firebaseUser.providerData && firebaseUser.providerData.length > 0 &&
                administrators.indexOf(firebaseUser.providerData[0].email) >= 0;
            console.log('admin status', isAdmin);

            return isAdmin;
        }
    }
});
