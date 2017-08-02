<?php

App::uses('DecisionTree', 'Model');

/**
 * Classe que atualiza as cores das arvores ja cadastradas
 */
class DtreeColorUpdateShell extends AppShell
{

    /**
     * Modelo da decision tree
     * @var Cake.Model
     */
    private $DecisionTree;

    private $classes = array(
        array(
            "id"    => 1,
            "cod"   => "1.",
            "color" => "#129912",
        ), array(
            "id"    => 2,
            "cod"   => "1.1.",
            "color" => "#1f4423",
        ), array(
            "id"    => 3,
            "cod"   => "1.1.1.",
            "color" => "#006400",
        ), array(
            "id"    => 4,
            "cod"   => "1.1.2.",
            "color" => "#00ff00",
        ), array(
            "id"    => 5,
            "cod"   => "1.1.3.",
            "color" => "#65c24b",
        ), array(
            "id"    => 6,
            "cod"   => "1.1.4.",
            "color" => "#687537",
        ), array(
            "id"    => 7,
            "cod"   => "1.1.5.",
            "color" => "#29eee4",
        ), array(
            "id"    => 8,
            "cod"   => "1.1.6.",
            "color" => "#77a605",
        ), array(
            "id"    => 9,
            "cod"   => "1.2.",
            "color" => "#935132",
        ), array(
            "id"    => 10,
            "cod"   => "2.",
            "color" => "#ffe599",
        ), array(
            "id"    => 11,
            "cod"   => "2.1.",
            "color" => "#45c2a5",
        ), array(
            "id"    => 12,
            "cod"   => "2.2.",
            "color" => "#f1c232",
        ), array(
            "id"    => 13,
            "cod"   => "2.3.",
            "color" => "#b8af4f",
        ), array(
            "id"    => 14,
            "cod"   => "3.",
            "color" => "#ffffb2",
        ), array(
            "id"    => 15,
            "cod"   => "3.1.",
            "color" => "#ffd966",
        ), array(
            "id"    => 16,
            "cod"   => "3.1.1.",
            "color" => "#ffe599",
        ), array(
            "id"    => 17,
            "cod"   => "3.1.2.",
            "color" => "#f6b26b",
        ), array(
            "id"    => 18,
            "cod"   => "3.2.",
            "color" => "#e974ed",
        ), array(
            "id"    => 19,
            "cod"   => "3.2.1.",
            "color" => "#d5a6bd",
        ), array(
            "id"    => 20,
            "cod"   => "3.2.2.",
            "color" => "#c27ba0",
        ), array(
            "id"    => 21,
            "cod"   => "3.2.3.",
            "color" => "#a64d79",
        ), array(
            "id"    => 22,
            "cod"   => "4.",
            "color" => "#ea9999",
        ), array(
            "id"    => 23,
            "cod"   => "4.1.",
            "color" => "#cc4125",
        ), array(
            "id"    => 24,
            "cod"   => "4.1.1.",
            "color" => "#dd7e6b",
        ), array(
            "id"    => 25,
            "cod"   => "4.1.2.",
            "color" => "#e6b8af",
        ), array(
            "id"    => 26,
            "cod"   => "4.1.3.",
            "color" => "#980000",
        ), array(
            "id"    => 27,
            "cod"   => "4.2.",
            "color" => "#999999",
        ), array(
            "id"    => 28,
            "cod"   => "4.2.1.",
            "color" => "#b7b7b7",
        ), array(
            "id"    => 29,
            "cod"   => "4.2.2.",
            "color" => "#434343",
        ), array(
            "id"    => 30,
            "cod"   => "4.2.3.",
            "color" => "#d9d9d9",
        ), array(
            "id"    => 31,
            "cod"   => "5.",
            "color" => "#0000ff",
        ), array(
            "id"    => 32,
            "cod"   => "6.",
            "color" => "#d5d5e5",
        ));

    /**
     * Função principal de execução
     */
    public function main($taskId = null)
    {
        $this->DecisionTree = new DecisionTree();

        $dtreeList = $this->DecisionTree->find('all', array(
            'conditions' => array(
                'DecisionTree.classe_legenda_id' => '2',
            ),
            'recursive'  => -1,
        ));

        foreach ($dtreeList as $decisionTree) {

            foreach ($decisionTree['DecisionTree']['dtree'] as &$node) {
                if ($node['kind'] == 'class') {
                    $colorNew = $this->findColorByValue($node['class']['value']);
                    if ($colorNew) {
                        $node['class']['color'] = $colorNew;
                    }
                }
            }

            $this->DecisionTree->create();

            $this->DecisionTree->save($decisionTree);
        }

        echo "cores atualizadas \n";
    }

    private function findColorByValue($value)
    {
        $color = null;
        foreach ($this->classes as $classe) {
            if ($classe['id'] == $value) {
                $color = $classe['color'];
                break;
            }
        }
        return $color;
    }
}
