<?php
App::uses('Classe', 'Model');
App::uses('File', 'Utility');

class ClasseService {

    public $Classe;

    public function __construct() {
        $this->Classe = new Classe();
    }

    /*
     * API
    */
    public function findAll($query) {

      $translateClasses = null;

      $result = [];      

      $limit = 50;
      if(isset($query['limit']) && $query['limit'] < 50){
         $limit = $query['limit'];
      }

      $page = 1;
      if(isset($query['page'])){
         $page = $query['page'];
      }      

      if(isset($query['language'])){
         
         $lang = $query['language'];
         
         $translateClassesFile = new File(
             APP_BASE_PATH . DS .
             "webroot" . DS .
             "js" . DS .          
             "assets" . DS .
             "langs" . DS .
             "classes_$lang.json"
         );

         if($translateClassesFile->exists()){
            $translateClasses = json_decode($translateClassesFile->read(),true);
         }                 
      }   

      $options = array('page' => $page,  'limit' => $limit);    

      foreach ($this->Classe->find("all", $options) as $key => $classe) {   

          $classeName = null;

          if(!empty($translateClasses) && !empty($translateClasses[$classe['Classe']['valor']])){
              $classeName = $translateClasses[$classe['Classe']['valor']]['name'];
          }

          $r = array(
              "id" => $classe['Classe']['valor'],
              "name" => $classeName ? $classeName:$classe['Classe']['classe'],
              "color" => $classe['Classe']['cor'],
              "l1" => $classe['Classe']['valor_l1'],
              "l2" => $classe['Classe']['valor_l2'],
              "l3" => $classe['Classe']['valor_l3']
          );
          $result[] = $r;
      }

      return $result;

    }

}
