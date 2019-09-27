/**
* Note: this file is provided by the fc3_common_assets package
 */
import $ from "jquery";
import  Masonry  from 'masonry-layout';

class ItemList {

    constructor( container ) {
        //get a reference to our main container
        this.$container = $(container);
        if ( !this.$container || !this.$container.length ) {
            return;
        }
        // the current state
        this.state = {
            currentView: 'list',
            currentFilters: ['offer', 'lend', 'borrow', 'wanted'],
            defaultOptions: ['offer', 'lend', 'borrow', 'wanted']
        };

        //setup child references
        this.$grid = $('.item-list-grid-view');
        this.$list = $('.item-list-list-view');
        this.$offerFilter = $('.item-list-offer-filter');
        this.$lendFilter = $('.item-list-lend-filter');
        this.$borrowFilter = $('.item-list-borrow-filter');
        this.$wantedFilter = $('.item-list-wanted-filter');
        this.$itemList = $('.item-list-view');
        this.$itemGrid = $('.item-grid-view');

        //attach listeners
        this.attachListeners();

        //reconcile the initial view state
        this.setState(this.state);
    }

    /**
     * Update the view with the new state
     * @param newState
     */
    setState( newState, cb ) {
        requestAnimationFrame(()=> {
            this.state = Object.assign({}, this.state, newState);
            this.reconcileView();
            if ( cb ) {
                cb();
            }
        });
    }

    setupMasonry = () => {

        $.each(this.$itemGrid,(idx,item)=>{
            new Masonry(item, {
                // options
                itemSelector: '.post-grid-item',
                columnWidth: '.grid-sizer',
                gutter:'.gutter-sizer',
                percentPosition: true
            });
        })

    };
    /**
     * Attach listeners to the required Elements
     */
    attachListeners = () => {
        // view filters
        this.$grid.click(this.onViewItemClicked.bind(this, 'grid'));
        this.$list.click(this.onViewItemClicked.bind(this, 'list'));
        // item filters
        this.$offerFilter.click(this.onFilterItemClick.bind(this, 'offer'));
        this.$lendFilter.click(this.onFilterItemClick.bind(this, 'lend'));
        this.$borrowFilter.click(this.onFilterItemClick.bind(this, 'borrow'));
        this.$wantedFilter.click(this.onFilterItemClick.bind(this, 'wanted'));
    };

    /**
     * Event handler for toggling a filter item
     * @param toggledValue
     */
    onFilterItemClick = ( toggledValue ) => {
        let {currentFilters} = this.state;
        let {defaultOptions} = this.state;
        let currentIdx = ~currentFilters.indexOf(toggledValue);
        let filterStatus;
        // remove it from the array or add it back
        if ( currentIdx ) {
            currentFilters = [...defaultOptions];
            currentFilters = currentFilters.filter(i => i !== toggledValue);
            filterStatus = 'filter';
        } else {
            currentFilters = [...currentFilters, toggledValue];
            filterStatus = 'reset';
        }
        //set the new state
        this.setState({ currentFilters });
        //call filter handler and specify if list is being filtered or unfiltered
        this.handleFilters(toggledValue, filterStatus);
    };

    /**
     * Dispatch filter or reset function
     * @param filterStatus
     */
    handleFilters = ( searchTerm, filterStatus ) => {
      switch(filterStatus) {
        case 'filter' :
          this.filterResults(searchTerm);
          break;
        case 'reset' :
          this.resetResults();
          break;
      }
    };

    filterResults = ( searchTerm ) => {
      let filterGrid = this.$itemGrid.children();
      let fitlerList = this.$itemList.children();
      let { currentView } = this.state;

      //hide all page results
      $('.post-grid-item').hide();
      $('.post-list-item').hide();

      //show only matching results across views
      filterGrid.each((i, item) => {
         if (item.className === 'post-grid-item') {
           $(item).find(`span.text-${searchTerm}`).parents('.post-grid-item').show();
           this.setupMasonry();
         }
      });

      fitlerList.each((i, item) => {
        if (item.className === 'post-list-item') {
          var results = $(item).find(`span.text-${searchTerm}`).parents('.post-list-item').show();
        }
      });
    };

    resetResults = () => {
      // show unfiltered items across views
      this.$itemGrid.children().show();
      this.$itemList.children().show();
      this.setupMasonry();
    };

    /**
     * Event handler for clicking on a view item
     */
    onViewItemClicked = ( newValue ) => {
        let {currentView} = this.state;
        if ( currentView !== newValue ) {
            currentView = newValue;
            this.setState({ currentView }, ()=> {
                //trigger masonry
                if ( currentView === 'grid' ) {
                    this.setupMasonry();
                }
            });
        }


    };


    reconcileView = () => {
        const {currentView, currentFilters} = this.state;
        const {
        $list,
        $grid,
        $offerFilter,
        $lendFilter,
        $borrowFilter,
        $wantedFilter,
        $itemList,$itemGrid} = this;

        //set view state
        if ( currentView === 'list' ) {
            $list.removeClass('inactive');
            $grid.addClass('inactive');
            $itemList.css({ 'display': 'block' });
            $itemGrid.css({ 'display': 'none' });
        } else {
            $list.addClass('inactive');
            $grid.removeClass('inactive');
            $itemList.css({ 'display': 'none' });
            $itemGrid.css({ 'display': 'block' });
        }
        // set filter state
        ~currentFilters.indexOf('offer')
        ? $offerFilter.removeClass('inactive')
        : $offerFilter.addClass('inactive');

        ~currentFilters.indexOf('borrow')
        ? $borrowFilter.removeClass('inactive')
        : $borrowFilter.addClass('inactive');

        ~currentFilters.indexOf('lend')
        ? $lendFilter.removeClass('inactive')
        : $lendFilter.addClass('inactive');

        ~currentFilters.indexOf('wanted')
        ? $wantedFilter.removeClass('inactive')
        : $wantedFilter.addClass('inactive');

    };

}

// setup
document.addEventListener("DOMContentLoaded", ()=> {
    const list = new ItemList(".item-list");
});


// export the list
export default ItemList;