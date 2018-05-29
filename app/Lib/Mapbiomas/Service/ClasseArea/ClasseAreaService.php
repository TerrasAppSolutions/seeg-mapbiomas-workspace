<?php
App::uses('ClasseArea', 'Model');

class ClasseAreaService
{

    public $ClasseArea;

    public function __construct()
    {
        $this->ClasseArea = new ClasseArea();
    }

    /*
     * API
     */

    public function get($id)
    {

        $usuarioAuth = $this->ClasseArea->authUser;

        $classeArea = $this->ClasseArea->find('first', array(
            'conditions' => array(
                'ClasseArea.id'         => $id,
                'ClasseArea.usuario_id' => $usuarioAuth['Usuario']['id'],
            ),
            'contain'    => $this->ClasseArea->contains['default'],
        ));

        return $classeArea;
    }

    public function query($options = null, $paginate = null)
    {

        $usuarioAuth = $this->ClasseArea->authUser;

        $options['contain'] = $this->ClasseArea->contains['default'];

        $options['conditions'] = isset($options['conditions']) ? $options['conditions'] : array();

        if (isset($options['query']['carta'])) {
            $options['conditions']['ClasseArea.carta'] = $options['query']['carta'];
        }

        if (isset($options['query']['status'])) {
            $options['conditions']['ClasseArea.status'] = $options['query']['status'];
        }

        if (isset($options['query']['classificacao_id'])) {
            $options['conditions']['ClasseArea.classificacao_id'] = $options['query']['classificacao_id'];
        }

        if ($usuarioAuth['Usuario']['id']) {
            $options['conditions']['ClasseArea.usuario_id'] = $usuarioAuth['Usuario']['id'];
        }

        $data = $this->ClasseArea->find('all', $options);

        if ($paginate) {
            $countPagesOpt = $options;
            unset($countPagesOpt['limit']);
            unset($countPagesOpt['page']);
            $total = $this->ClasseArea->find('count', $countPagesOpt);
            $data  = array(
                'data'       => $data,
                'page'       => $paginate['page'],
                'totalPages' => ceil($total / $options['limit']),
                'total'      => $total,
            );
        }

        return $data;
    }

    public function save($data)
    {

        $usuarioAuth = $this->ClasseArea->authUser;

        if (empty($data['ClasseArea']['usuario_id']) && $usuarioAuth['Usuario']['id']) {
            $data['ClasseArea']['usuario_id'] = $usuarioAuth['Usuario']['id'];
        }

        unset($data['ClasseArea']['modified']);

        // save classe area
        $dataSaved = $this->ClasseArea->save($data);

        /*
         * Retorna a dado salvo
         */
        $classeArea = $this->get($this->ClasseArea->id);

        return $classeArea;
    }

    public function exportCSV($options)
    {

        $usuarioAuth = $this->ClasseArea->authUser;

        $options['contain'] = $this->ClasseArea->contains['default'];

        $options['conditions'] = isset($options['conditions']) ? $options['conditions'] : array();

        $options['conditions']['ClasseArea.status'] = '2';

        if ($usuarioAuth['Usuario']['id']) {
            $options['conditions']['ClasseArea.usuario_id'] = $usuarioAuth['Usuario']['id'];
        }

        $data = $this->ClasseArea->find('all', $options);

        $exportData = "";

        if ($data) {
            // ordena e extrai as chaves (colunas) do primeiro elemento
            $pixelKeys = json_decode($data[0]['ClasseArea']['pixel_values'], true)['P0'];

            ksort($pixelKeys);

            $pixelValuesKeys = array_keys($pixelKeys);

            $exportData .= implode(", ", $pixelValuesKeys) . "\n";

            foreach ($data as $key => $classeArea) {
                $pixelValues = json_decode($classeArea['ClasseArea']['pixel_values'], true);
                ksort($pixelValues);
                foreach ($pixelValues as $pxkey => $pxvalue) {                    
                    ksort($pxvalue);                    
                    $exportData .= implode(", ", $pxvalue) . "\n";
                }

            }
        }
       
        return $exportData;
    }

    public function delete($id)
    {
        return $this->ClasseArea->delete($id);
    }

}
