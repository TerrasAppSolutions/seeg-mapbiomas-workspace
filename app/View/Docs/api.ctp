<?php 
    $this->layout = "docs";
?>
<!-- Initializer -->
<script>
    $('document').ready(function(){
        Flatdoc.run({
            fetcher: Flatdoc.file('../docs/api/api_md')
        });                  
    });
</script>
<div class="content-root" role="flatdoc">
    <div class="menubar">
        <div class="section">
            <a href="http://seeg-mapbiomas.terras.agr.br">
                <img src="http://seeg-mapbiomas.terras.agr.br/img/mapbiomas_logo.png" width="100%" />
            </a>
        </div>
        <div class="menu section" role="flatdoc-menu">
        </div>
    </div>
    <div class="content" role="flatdoc-content">
    </div>
</div>