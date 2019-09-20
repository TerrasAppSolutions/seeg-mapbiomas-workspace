<?php
App::uses('AppModel', 'Model');
/**
 * IntegrationFilter Model
 *
 */
class MosaicCarta extends AppModel {
    // public $useTable = 'mosaic_rf';

    public $belongsTo = array(        
        'MosaicCartaProject' => array(
            'className' => 'MosaicCartaProject',
            'foreignKey' => 'project_id',
            'conditions' => '',
            'fields' => array(),
            'order' => ''
        )
    );

    // esse valor pode ser recuperado no serviço
    var $elements = array();

    public function afterSave($results, $options = false) {
        // pr($this->getInsertID());
        // pr($results);
        // if(isset($results)) {
        //     // $this->inserted_ids[] = $this->getInsertID();
        //     $this->inserted_ids[] = $this->find('first', array(
        //         'conditions' => array('id' => $results)
        //     ));
        // }

        $id = $this->getInsertID();

        // for ($i=0; $i < sizeof($id); $i++) { 
        //     $this->elements[] = $this->find('first', array(
        //         'conditions' => array('MosaicCarta.id' => $id[$i])
        //     ));
        // }

        $this->elements[] = $this->find('first', array(
            'conditions' => array('MosaicCarta.id' => $id)
        ));

        return $results;
    }
}
