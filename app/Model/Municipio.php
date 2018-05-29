<?php
App::uses('AppModel', 'Model');
/**
 * Municipio Model
 *
 */
class Municipio extends AppModel {
    public $belongsTo = array(
        'Estado' => array(
            'className' => 'Estado',
            'foreignKey' => 'id_estado'
        )
    );
}
