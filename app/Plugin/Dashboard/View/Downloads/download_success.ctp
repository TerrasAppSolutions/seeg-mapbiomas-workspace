<title>W3.CSS Template</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
	html,
	body,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-family: "Roboto", sans-serif
	}
</style>
<!-- <h3>Imagens disponíveis para download</h3>
<p>
	<?php foreach ($msg as $key => $value) {?>
	<a href="<?php echo $value; ?>" target="_blank">Link
		<?php echo $key + 1; ?>
	</a>
	<br>
	<?php } ?>
</p> -->

<div class="w3-container w3-white w3-margin-bottom">
	<h2 class="w3-text-grey w3-padding-16">
		Imagens disponíveis para download
	</h2>
	<div class="w3-container">
		<?php foreach ($msg as $key => $value) {?>
			<h6 class="w3-text-teal">
				<a href="<?php echo $value; ?>" target="_blank"><i class="fa fa-link fa-fw"></i> Link
					<?php echo $key + 1; ?>
				</a>
			</h6>
		<?php } ?>
	</div>
</div>