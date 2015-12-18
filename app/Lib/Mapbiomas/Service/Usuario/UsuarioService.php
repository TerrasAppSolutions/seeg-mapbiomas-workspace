<?php
App::uses('Usuario', 'Model');
App::uses('Bioma', 'Model');
App::uses('HttpSocket', 'Network/Http');
App::uses('File', 'Utility');

class UsuarioService {

    public $Usuario;
    public $Bioma;
    
    public function __construct() {
        $this->Usuario = new Usuario();
        $this->Bioma = new Bioma();
    }

    /*
     * API
    */
    public function get($id) {
        $usuario = $this->Usuario->find('first', array(
            'conditions' => array(
                'Usuario.id' => $id
            ) ,
            'contain' => $this->Usuario->contains['default']
        ));

        return $usuario;
    }

    public function query($options = null, $paginate = null) {

        $options['contain'] = $this->Usuario->contains['default'];

        $usuarios = $this->Usuario->find('all', $options);

        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $data = array(
                'data' => $data,
                'page' => $this->servicePaginate['page'],
                'totalPages' => ceil($this->Usuario->find('count', $countPagesOpt) / $this->serviceOptions['limit']) ,
            );
        }

        return $usuarios;
    }

    public function googleAuth($data) {

        $HttpSocket = new HttpSocket();

        $googleAuthCheck = $HttpSocket->get('https://www.googleapis.com/oauth2/v3/tokeninfo', array(
            'id_token' => $data['token']
        ));

        $googleAuthCheckBody = json_decode($googleAuthCheck['body'], true);

        $resposta = array(
            'name' => isset($googleAuthCheckBody['name']) ? $googleAuthCheckBody['name']: "" ,
            'family_name' => isset($googleAuthCheckBody['family_name']) ? $googleAuthCheckBody['family_name']: "",
            'given_name' => isset($googleAuthCheckBody['given_name']) ? $googleAuthCheckBody['given_name']: "",
            'email' => isset($googleAuthCheckBody['email']) ? $googleAuthCheckBody['email']: "",
            'imageUrl' => isset($googleAuthCheckBody['picture']) ? $googleAuthCheckBody['picture']: "",
            'profileId' => isset($googleAuthCheckBody['sub']) ? $googleAuthCheckBody['sub']: "",
            'signin' => false,
            'approved' => false,
            'token' => $data['token']
        );

        $usuario = $this->Usuario->findByEmail($resposta['email']);

        if ($usuario) {
            $resposta['signin'] = true;
            $resposta['approved'] = $usuario['Usuario']['aprovado'] == '1' ? true : false;
        }

        return $resposta;
    }

    public function googleCadastro($data) {

        $cdata = $this->googleAuth($data);

        // cadastrar usuario
        $usuario = array(
            'Usuario' => array(
                'nome' => $cdata['name'],
                'email' => $cdata['email'],
                'password' => $cdata['profileId'],
                'perfil_id' => '2',
                'aprovado' => '0',
            )
        );

        $fileContaAceitas = new File(APP_BASE_PATH.DS."Config".DS."data".DS."contas_aceitas.json");

        $contasAceitas = json_decode($fileContaAceitas->read(),true);


        // verifica se o email esta na lista de email pre aprovados
        foreach ($contasAceitas['contas'] as $key => $contaEmail) {
            if($contaEmail == $cdata['email']){
                $usuario['Usuario']['aprovado'] = '1';
                break;
            }
        }

        $bioma = $this->Bioma->findByNome($data['bioma']);

        $dataSouce = $this->Usuario->getDataSource();

        $dataSouce->begin();

        $this->Usuario->save($usuario);

        $this->Usuario->UsuarioBioma->save(array(
            'UsuarioBioma' => array(
                'usuario_id' => $this->Usuario->id,
                'bioma_id' => $bioma['Bioma']['id'],
            )
        ));

        $dataSouce->commit();

        $cdata['signin'] = true;
        $cdata['approved'] = $usuario['Usuario']['aprovado'] == 1 ? true:false;

        return $cdata;
    }

    public function googleLogin($data) {

        $cdata = $this->googleAuth($data);

        $usuario = $this->Usuario->find('first',array(
            'conditions' => array(
                'Usuario.email' => $cdata['email']
            ),
            'contain' => $this->Usuario->contains['default']
        ));

        return $usuario;
    }

    /*
     * FIM API
    */
}
