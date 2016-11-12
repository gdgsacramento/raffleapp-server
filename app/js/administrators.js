ra.factory('Administrators', function ($firebaseAuth) {
    var administrators = [];
    administrators.push('Nathaniel Jenan');
    administrators.push('Oleg Kalugin');
    administrators.push('Alain Chautard');

    var firebaseUser;

    $firebaseAuth().$onAuthStateChanged(function (nextState) {
        firebaseUser = nextState;
    });

    return {
        isAdminUser: function () {
            console.log('checking admin status of ', firebaseUser);
            var isAdmin = firebaseUser && administrators.indexOf(firebaseUser.displayName) >= 0;
            console.log('admin status', isAdmin);

            return isAdmin;
        }
    }
});
