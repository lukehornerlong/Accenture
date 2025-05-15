﻿Public Class cEncryption
    Private closeform As String = ""
    Private plaintext As String 'holds the plain text in textbox
    Private cyphertext As String 'holds the text once cyphered
    Private randomnumber As Integer 'holds the random number
    Private placeinstring As Integer 'hold place in string
    Private placeincypher As Integer
    Sub resetcloseform() 'used to determine if we want to just kill the form Ittl change the string to 'die' and when that happens it kills whatever forms open just as an error prevention method
        closeform = ""
    End Sub
    Function returncloseform() 'this is used to call close form if we feel like killing a form
        Return closeform
    End Function
    Sub backtothemenu(sender As Form) 'takes someone back to the menu
        Dim menu As New Form1
        menu.Show()
        sender.Close()
    End Sub
    Public Overridable Sub encrypt()
        'do nothing as this is base class
    End Sub
    Public Overridable Sub decrypt()
        'do nothing as this is a base class
    End Sub
    Function returnrandomnumber(minim As Integer, maxim As Integer) 'random number generator
        Randomize()
        randomnumber = Int((maxim * Rnd()) + minim)
        Return randomnumber

    End Function
    Sub setcyphertext(cyphert As String) 'used to define the cypher text
        cyphertext = cyphert
    End Sub
    Function returncyphertext() As String 'used to return the cypher text
        Return cyphertext
    End Function
    Sub setplaintext(plain As String) 'sets the plain text when called
        plaintext = plain
    End Sub
    Function returnplaintext() As String 'returns the plain text
        Return plaintext
    End Function
    Function getalphabet() As String 'returns the alphabet
        Return "abcdefghijklmnopqrstuvwxyz"

    End Function
    Sub setplaceinstring(number As Integer) 'allows certain encryption to keep track of a place in a string
        placeinstring = number
    End Sub
    Sub setplaceincypher(number As Integer) 'allows certain encryption to keep track of a place in the cyphertexxt
        placeincypher = number
    End Sub
    Function returnplaceincypher() 'returns the place in the cypher
        Return placeincypher
    End Function
    Sub movealongright() 'this is used in vernam to rotate between the letters in order to display the same character from each string
        placeinstring += 1
        placeincypher += 1
    End Sub
    Sub movealongleft()
        placeinstring -= 1
        placeincypher -= 1
    End Sub
    Function DoanXOR(input As String, key As String) 'used to xor to binary strings
        Dim stringer As String = ""
        Try
            For i = (0) To Len(input) - 1

                If input(i) = "0" And key(i) = "1" Then
                    stringer = stringer & "1"
                ElseIf input(i) = "1" And key(i) = "0" Then
                    stringer = stringer & "1"
                Else
                    stringer = stringer & "0"
                End If
            Next
        Catch

        End Try
        Return stringer
    End Function


    Function returnplaceinstring() 'returns the place in the string during vernam
        Return placeinstring
    End Function
    Function convertcharactertobinary(character As Char) 'used to convert a charcter into binary by getting the asc value and running it through my tobinary() function
        Dim value As Integer
        value = Asc(character)
        Return ToBinary(value)
    End Function
    Function binarytochar(bin As String, dore As Boolean) 'this finds the value of a binary number and converts it into a character
        'MsgBox(bin)
        Dim dig As String, p As Integer
        Dim dec, B, d As Integer
        p = 0
        For x As Integer = bin.Length - 1 To 0 Step -1
            dig = bin.Substring(x, 1)
            If Not (dig = "0" Or dig = "1") Then
                dec = 0
                MsgBox("Incorrect entry.  ")
                Exit For
            End If
            Double.TryParse(dig, B)
            d = B * (2 ^ p)
            dec = dec + d
            p = p + 1
        Next x
        'MsgBox(dec)
        If dore = True Then
            ' MsgBox(dec)
            Try
                Return Chr(dec + 130)
            Catch
                MsgBox("your code contains some invalid characters  try using a simpler file")
                closeform = "die"
            End Try

        Else



            Return Chr(dec)
        End If

    End Function




    Function ToBinary(dec As Integer) As String 'this converts a number into binary
        Dim filler As String = ""
        Dim bin As Integer
        Dim output As String
        While dec <> 0
            If dec Mod 2 = 0 Then
                bin = 0
            Else
                bin = 1
            End If
            dec = dec \ 2
            output = Convert.ToString(bin) & output
        End While
        If output Is Nothing Then
            Return "0"
        Else
            If Len(output) <> 8 Then
                For i = Len(output) To 7
                    filler = filler & "0"
                Next
                output = filler & output
            End If
            Return output
        End If
    End Function
    Function Scramble(ByVal phrase As String) As String 'this will take a string and shuffle all the letters I use this in the questions to create belivable answers
        Static rand As New Random()
        Return New String(phrase.ToLower.ToCharArray.OrderBy(Function(r) rand.Next).ToArray)
    End Function
    Sub limitstring(plaintext As String, textbox As TextBox, length As Integer) 'stops the string from being longer than ten charcters so it dosen't go out of the textbox
        If Len(plaintext) > length Then
            textbox.Text = plaintext.Substring(0, plaintext.Length - 1) 'snips off the last character
            textbox.SelectionStart = Len(textbox.Text) 'moves cursor back to the end of the word

        End If
    End Sub
End Class
