<?php 
$dataList = array_splice($data['list'],0,20);
?>
<link rel="stylesheet" href="/bower_components/bootstrap/dist/css/bootstrap.min.css" />
<script src="/bower_components/jquery/dist/jquery.min.js"></script>
<script>
    $(function() {
        setInterval(function() {
            $("#page").load('/export/classificacao_tarefas/isalive #content');
        }, 5000);
    });
</script>
<div id="page">
    <div id="content" class="container-fluid">
        <div class="row">
            <div class="col-md-6">
                <table class="table table-condensed table-bordered">
                    <tbody>
                        <?php foreach ($dataList as $key => $value) {?>
                        <tr>
                            <td>
                                <?php echo $value['exporting'];?>
                            </td>
                            <td>
                                <?php echo $value['date'];?>
                            </td>
                            <td>
                                <?php echo isset($value['msg']) ? $value['msg']."<br/>" : "";?>
                                <?php echo isset($value['except']) ? $value['except'] : "";?>
                            </td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>