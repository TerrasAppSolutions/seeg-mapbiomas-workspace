<?php
App::uses('AppModel', 'Model');

/**
 * Estatistica Model
 *
 */
class Estatistica extends AppModel { 

	public $useTable = 'estatisticas';    

	public $contains = array(
        'default' => array()
    );      
    
}
