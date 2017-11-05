package com.example.tudor.ma_java;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;

public class Details extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);

        // Get the Intent that started this activity and extract the string
        Intent intent = getIntent();
        String name = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);
        String position = intent.getStringExtra(MainActivity.EXTRA_MESSAGE_TWO);
        System.out.println(name);
        System.out.println(position);

        // Capture the layout's TextView and set the string as its text
        EditText nameText = (EditText) findViewById(R.id.textName);
        nameText.setText(name);

        EditText positionText = (EditText) findViewById(R.id.textPosition);
        positionText.setText(position);
    }
}
