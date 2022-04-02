<script>
  /* FETCH DATA FROM SPREADHSEET */
  console.warn('GETTING DATA')
  google.script.run.withSuccessHandler(init).getData();

  function init(data) {
    $('#loader').remove();
    $('body').css('overflow', '');

    _init(data);
  }

  {{backtest.js}}
  {{helpers.js}}

  function _init(data) {
    try { new Backtest(data); } catch (err) {
      Helpers.showError({
        title: 'Unexpected error occurred',
        message: '',
        userSettings: data.settings
      },
      {
        error: err.stack,
        name: err.name,
        message: err.message
      });

      console.error(err);
    }
  }
</script>