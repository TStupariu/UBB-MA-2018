package com.example.tudor.ma_java;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {

    // Defined Array values to show in ListView
    final String[] names = new String[]{"Amy Jameson", "Julia Julianssonyen"
    };

    final String[] positions = new String[]{
            "CEO",
            "CTO"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final EditText emailInput = (EditText) findViewById(R.id.emailInput);
        final Button button = (Button) findViewById(R.id.btnEmail);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String recipient = emailInput.getText().toString();
                System.out.println("FUCKING DICK" + recipient);
                if (recipient.equals(""))
                {
                    Toast.makeText(getApplicationContext(),
                            "Email address can not be empty!", Toast.LENGTH_LONG)
                            .show();
                }
                else {
                    Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.fromParts(
                            "mailto", recipient, null));
                    startActivity(Intent.createChooser(intent, "Choose an Email client :"));
                }
            }
        });

        final ListView listView = (ListView) findViewById(R.id.employees);

        // Define a new Adapter
        // First parameter - Context
        // Second parameter - Layout for the row
        // Third parameter - ID of the TextView to which the data is written
        // Forth - the Array of data

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, android.R.id.text1, names);


        // Assign adapter to ListView
        listView.setAdapter(adapter);

        // ListView Item Click Listener
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {

                // ListView Clicked item index
                int itemPosition = position;

                // ListView Clicked item value
                String itemValue = (String) listView.getItemAtPosition(position);

            }
        });

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position,
                                    long id) {
                String entry= (String) parent.getAdapter().getItem(position);
                Intent intent = new Intent(MainActivity.this, Details.class);
                String message = entry;
                intent.putExtra(EXTRA_MESSAGE, message);
                intent.putExtra(EXTRA_MESSAGE_TWO, positions[position]);
                startActivityForResult(intent, 1234);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 1234 && resultCode == RESULT_OK && data != null) {
            String num1 = data.getStringExtra("Name");
            String num2 = data.getStringExtra("Position");
            System.out.println(num1);
            System.out.println(num2);
            for(int i = 0; i < names.length; i++)
            {
                if (num1.equals(names[i]))
                {
                    positions[i] = num2;
                }
            }
        }
    }

    public static final String EXTRA_MESSAGE = "com.example.myfirstapp.NAME";
    public static final String EXTRA_MESSAGE_TWO = "com.example.myfirstapp.POSITION";

    public void sendMessage(View view) {
        Intent intent = new Intent(this, Details.class);
        intent.putExtra(EXTRA_MESSAGE, "AJSDkjshag");
        startActivity(intent);
    }
}
