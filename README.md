# ajaxtable
Ajax wrapper for table display for sorting and pagination

## Installation
Required files are add

    <link rel="stylesheet" href="css/ajaxtable.css">
    <script src="js/plugins.css"></script>
    //Then you can do
    $(".ajaxtable").ajaxtable();

## Response
The plugin expects the response to be (this is an laravel example )

    return Response::json(array(
                         'data'=>View::make('just_table_rows_views', compact('collection'))->render(),
                         'pagination'=> (string) $collection->links()
                         )
                      );
## Markup
You can either pass **data-requestUrl="yourajaxurl.php"** in your table class or initialize it through the plugin call like

    $('ajaxtable').ajaxtable({ requestUrl : 'yourrequestUrl.php'})

Now add a div **id="paginationWrapper"** where you want your pagination to be displayed

## Default Markups
**sorting :**         

    <th class="sortableHeading" data-orderBy="First_Name">
The best thing about this plugin is it will automatically take the parameters from the current url and add it to your ajax request so this plugin will work with filtering and searching also.

Please run the index.html in your localhost and see the results. The parameters for the request are all changable through plugin options. Please read the source code for this.
