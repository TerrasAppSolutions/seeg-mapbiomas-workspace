<div class="container" style="margin-top:40px">
    <br>
    <br>
    <div class="row" style="display: none">
        <div class="col-sm-6 col-md-4 col-md-offset-4">
            <div class="form-login" style="width:600px;margin: 0 auto;">
                <?php echo $this->Form->create('Usuario', array('class' => 'form-login')); ?>
                <div class="form-group">
                    <?php echo $this->Form->input('email', array('placeholder' => 'E-mail', 'autofocus', 'class' => 'form-control', 'label' => false,'value' => 'teste@teste.com')); ?>
                </div>
                <div class="form-group">
                    <?php echo $this->Form->input('password', array('placeholder' => 'Senha', 'class' => 'form-control', 'label' => false,'value' => '123123')); ?>
                </div>
                <div class="footer">
                    <?php echo $this->Form->submit('Acessar', array('class' => 'btn bg-olive btn-block')); ?>
                </div>
                <?php echo $this->Form->end(); ?>
                <br/>
            </div>
        </div>
    </div>
    <div class="row" id="google-login-btn">
        <div class="col-sm-6 col-md-4 col-md-offset-4">
            <span style="float: left;margin: 8px;">Log in with google:</span>
            <div class="g-signin2" data-onsuccess="onSignIn"></div><br/>
            <span style="float: left;margin: 8px;">Log in with a guest account: &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <a href="guest_login" class="btn btn-info">Guest</a>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6 col-md-4 col-md-offset-4">
            <div id="form-cadastro" class="panel panel-default" style="display: none">
                <div class="panel-heading">
                    <strong>Enter additional informations</strong>
                </div>
                <div class="panel-body">
                    <form id="form-usuario" role="form" action="#" method="POST">
                        <fieldset>
                            <div class="row">
                                <div class="center-block text-center">
                                    <img id="form-usuario-foto" class="profile-img img-circle"
                                    src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120" alt="Foto do Perfil"/>
                                    <h3 id="form-usuario-nome"></h3>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 col-md-10  col-md-offset-1">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <span class="input-group-addon">
                                            <i class="glyphicon glyphicon-user"></i>
                                            </span>
                                            <input id="form-usuario-email" class="form-control" placeholder="E-mail" name="email" type="text" disabled autofocus>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Bioma</label>
                                        <select id="form-usuario-bioma" name="bioma" class="form-control" required>
                                            <option value="">Selecione um bioma</option>
                                            <option value="AMAZONIA">Amazônia</option>
                                            <option value="MATA ATLANTICA">Mata Atlântica</option>
                                            <option value="PANTANAL">Pantanal</option>
                                            <option value="CERRADO">Cerrado</option>
                                            <option value="CAATINGA">Caatinga</option>
                                            <option value="PAMPA">Pampa</option>
                                            <option value="ZONA COSTEIRA">Zona Costeira</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <input id="form-usuario-cadastrar" type="submit" class="btn btn-lg btn-primary btn-block" value="Cadastrar">
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12-md">
            <div id="cadastro-sucesso" class="alert alert-success" role="alert" style="display: none">Cadastro concluído. Aguarde a aprovação do seu cadastro.</div>
            <div id="cadastro-aprovar" class="alert alert-warning" role="alert" style="display: none">Aguarde a aprovação do seu cadastro.</div>
        </div>
    </div>
</div>
<script src="https://apis.google.com/js/platform.js" async defer></script>
<script>
    var user = {};
    window.onload = function(){
    $('#form-usuario').submit(function(e){
        user.bioma = $('#form-usuario-bioma').val();
        googleCadastro(user);
        return false;
    });
    };
    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        var googleUserData = {
            id:profile.getId(),
            name:profile.getName(),
            email: profile.getEmail(),
            imageUrl :profile.getImageUrl()
        };
        var googleAuthData = {
            token: googleUser.getAuthResponse().id_token
        };

        googleAuth(googleAuthData,function(userData){
            user = userData;
            if(userData.signin == false){
                $('#google-login-btn').hide();
                $('#form-cadastro').fadeIn('fast');
                setDataUserForm(userData);
            }else if(userData.signin == true && userData.approved == true){
                googleLogin(userData);
            }else if(userData.signin == true && userData.approved == false){
                $('#cadastro-aprovar').show();
            }
        });
    }
    function googleAuth(authData,callback){
        $.post('../service/usuarios/googleauth', authData, function(data) {
            callback(data);
        });
    }
    function googleLogin(userData){
        $.post('../service/usuarios/googlelogin', userData, function(data) {
            location.reload();
        });
    }
    function googleCadastro(userData){
        $.post('../service/usuarios/googlecadastro', userData, function(respUserData) {
            if(respUserData.signin == true && respUserData.approved == true){
                googleLogin(respUserData);
            }else if(respUserData.signin == true && respUserData.approved == false){
                $('#form-cadastro').hide();
                $('#cadastro-sucesso').show();
            }
        });
    }
    function setDataUserForm(userData){
        $('#form-usuario-nome').html(userData.name);
        $('#form-usuario-foto').attr('src',userData.imageUrl);
        $('#form-usuario-email').val(userData.email);
    }
</script>
