<?php

App::uses('File', 'Utility');
App::uses('Folder', 'Utility');
App::uses('Component', 'Controller');

class UploadComponent extends Component {

    public function save($files, $isArray = false) {

        if ($isArray == false) {
            $files = array($files);
        }
        
        $uploadDir = time() . "_" . uniqid();
        $basePath = ROOT . DS . APP_DIR . DS . WEBROOT_DIR;
        $fileUploadPath = "/files/uploads/" . $uploadDir . "/";

        new Folder($basePath . $fileUploadPath, true);

        $respFiles = array();

        foreach ($files as $file) {
            $File = new File($file['tmp_name']);
            //$FileName = time() . "_" . uniqid() . "_" . $file['name'];
            $FileName = $file['name'];

            $copy = $File->copy($basePath . $fileUploadPath . $FileName, true);

            if (!$copy) {
                throw new Exception('Erro ao enviar arquivo');
            }

            $File->delete();

            $respFiles[] = array(
                'local' => $fileUploadPath . $FileName,
                'nome' => $file['name'],
                'tipo' => $file['type'],
            );
        }

        return $respFiles;
    }

}
