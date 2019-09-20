<?php
App::uses('AppModel', 'Model');
/**
 * IntegrationFilter Model
 *
 */
class Classification extends AppModel {
    // public $useTable = "random_forest";

    // esse valor pode ser recuperado no serviço
    var $elements = array();

    public function afterSave($results, $options = false) {

        $id = $this->getInsertID();

        $this->elements[] = $this->find('first', array(
            'conditions' => array('Classification.id' => $id)
        ));

        return $results;
    }
}
