<?php
App::uses('AppModel', 'Model');
App::uses('DecisionTreeParameter', 'Lib/Mapbiomas/Service/Classificacao');

/**
 * ClassificacaoTarefa Model
 *
 */
class ClassificacaoTarefa extends AppModel
{

    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Classificacao' => array(
            'className'  => 'Classificacao',
            'foreignKey' => 'classificacao_id',
            'conditions' => '',
            'fields'     => '',
            'order'      => '',
        ),
    );

    public $contains = array(
        'default' => array(
            'Classificacao' => array(
                'Bioma'       => array(
                    'fields' => array('nome'),
                ),
                'DecisionTree',
                'Carta'       => array(
                    'fields' => array('codigo'),
                ),
                'CartaRegiao' => array(
                    'fields' => array('regiao'),
                ),
                'Colecao'
            ),
        ),
    );

    public function afterFind($results, $primary = false)
    {

        $DecisionTreeParameter = new DecisionTreeParameter();

        foreach ($results as $key => &$val) {
            if (isset($val['Classificacao']['DecisionTree'])) {

                $Classificacao = array(
                    "Classificacao" => $val['Classificacao'],
                );

                $DecisionTree = array(
                    'DecisionTree' => $val['Classificacao']['DecisionTree'],
                );

                $dtree = json_decode($DecisionTreeParameter->buildDtreeParam($Classificacao, $DecisionTree), true);

                $val['Classificacao']['DecisionTree']['dtree'] = $dtree;
            }

            if (isset($val['Classificacao']['Colecao']['config'])) {
                $val['Classificacao']['Colecao']['config'] = json_decode($val['Classificacao']['Colecao']['config'], true);                                
            }  
        }
        return $results;
    }
}
