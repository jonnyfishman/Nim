<template>
  <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>Game Result</h2>
        </header>

        <section class="modal-section">
            <p>{{ modal.text }}</p>
        </section>

        <footer class="modal-footer">
          <button @click.once="this.$emit('closeModal')" class="btn">Close</button>
        </footer>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    modal: {
      state: Boolean,
      text: String
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal-backdrop {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index:1000;
    }

    .modal {
      background: #FFFFFF;
      box-shadow: 2px 2px 20px 1px;
      overflow-x: auto;
      display: flex;
      flex-direction: column;
      border-radius:1em;
      min-width:50%;
    }

    .modal-header,
    .modal-footer,
    .modal-section {
      padding: 1em;
      position:relative;
      display: flex;
    }

    .modal-header {
      background:#FE5F55;
      color:#fff;
      border-bottom: 1px solid #eeeeee;
    }
    .modal-header h2 {
      color:inherit;
      margin:auto;
    }

    .modal-footer {
      border-top: 1px solid #eeeeee;
    }

    button {
      min-width:50%;
      margin:0;
    }
</style>
