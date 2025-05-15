﻿Public Class Ceaserloader
    Private TheCCeaserloader As New CCaeserLoader
    Private filePath As String
    Private cyphernumba As Integer = 0
    Private caesar As New caesar
    Private vernamc As New vernamcypher
    Private completefile As String = ""
    Private threader As Threading.Thread
    Dim binarychar As String
    Dim binarycypherchar As String
    Dim vcyphercounter As Integer
    Dim vernamcyphers As String
    Dim officialvernatext As String
    Dim visualveratext As String
    Dim percentagev As Integer = 0

    '   Private type As New String
    Private Sub Ceaserloader_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        'vernampanel.Show()
        'Ceaserpanel.Hide()
        cyphernumber.Text = 0
        vcyphercounter = 0
        Me.FormBorderStyle = FormBorderStyle.FixedSingle

        Select Case OpenFileDialog1.ShowDialog()
            Case DialogResult.OK
                filePath = OpenFileDialog1.FileName
                caesar.ceasercypher(My.Computer.FileSystem.ReadAllText(filePath), textdisplay, 0)
            Case Else
        End Select

        completefile = textdisplay.Text        'If Len(completefile) > 1000 Then
        'For i = 0 To 1000 'limits file to 600 characters to improve efficency
        'completefile = completefile & textdisplay.Text(i)
        '    Next
        'End If

        If TheCCeaserloader.returndore = True Then
            'MsgBox("got it")
            completefile = completefile.Where(Function(x) Not Char.IsWhiteSpace(x)).ToArray()
            textdisplay.Text = completefile
            MsgBox(completefile)
            percentage.Maximum = Len(completefile)
        ElseIf TheCCeaserloader.returndore = False And vernampanel.Visible = True Then
            ' MsgBox("recived")
            completefile = My.Computer.FileSystem.ReadAllText(filePath)
            textdisplay.Text = completefile
            percentage.Maximum = Len(completefile)
        End If
        frequencyanalysis(textdisplay.Text)
    End Sub

    Private Sub Ceaserloader_BackColorChanged(sender As Object, e As EventArgs) Handles Me.BackColorChanged
        If Me.BackColor = Color.Black Then
            Me.BackColor = Color.LightGreen
            TheCCeaserloader.setdore(True)
        ElseIf Me.BackColor = Color.White Then
            Me.BackColor = Color.LightGreen
            TheCCeaserloader.setdore(False)
        End If
    End Sub

    Private Sub Minus_Click(sender As Object, e As EventArgs) Handles Minus.Click
        If cyphernumba > -10 Then
            cyphernumba -= 1

            If TheCCeaserloader.returndore = True Then
                caesar.ceasercypher(My.Computer.FileSystem.ReadAllText(filePath), textdisplay, cyphernumba)

            Else
                caesar.decryptceasercypher(My.Computer.FileSystem.ReadAllText(filePath), textdisplay, cyphernumba)
            End If
            cyphernumber.Text = cyphernumba
            frequencyanalysis(textdisplay.Text)
        End If

    End Sub

    Private Sub plus_Click(sender As Object, e As EventArgs) Handles plus.Click
        If cyphernumba <= 10 Then
            cyphernumba += 1

            If TheCCeaserloader.returndore = True Then
                caesar.ceasercypher(My.Computer.FileSystem.ReadAllText(filePath), textdisplay, cyphernumba)

            Else
                caesar.decryptceasercypher(My.Computer.FileSystem.ReadAllText(filePath), textdisplay, cyphernumba)
            End If
            cyphernumber.Text = cyphernumba
            frequencyanalysis(textdisplay.Text)
        End If

    End Sub

    Private Sub save_Click(sender As Object, e As EventArgs) Handles save.Click
        Select Case SaveFileDialog1.ShowDialog()
            Case DialogResult.OK
                If vernampanel.Visible = True Then
                    MsgBox(textdisplay.Text)
                    My.Computer.FileSystem.WriteAllText(SaveFileDialog1.FileName, textdisplay.Text, True)

                Else
                    My.Computer.FileSystem.WriteAllText(SaveFileDialog1.FileName, textdisplay.Text, True)

                End If
                MsgBox("file saved")
                Dim menu As New Form1
                menu.Show()
                Me.Close()
            Case Else
                MsgBox("ERROR")
        End Select
    End Sub
    Private Sub frequencyanalysis(input As String)
        frequency.Items.Clear()
        Dim chararray() As Char = input.ToCharArray
        Dim distinctarray() As Char = chararray.Distinct.ToArray

        Dim counter As Integer = 0
        For i As Integer = 0 To distinctarray.Count - 1
            counter = 0
            For j As Integer = i To chararray.Count - 1
                If distinctarray(i) = chararray(j) Then
                    counter += 1
                End If
            Next

            frequency.Items.Add(distinctarray(i) + "   =   " + counter.ToString)
        Next

    End Sub
    Private Sub removenastycharacters()
        Dim holders As Integer
        Dim holderslist(10000) As Integer
        Dim holderslistcounter As Integer = 0
        For i = 0 To Len(visualveratext) - 1
            If Asc(visualveratext(i)) < 125 And visualveratext(i) <> " " Then
                holders = Asc(visualveratext(i))
                holderslist(holderslistcounter) = holders
                holderslistcounter += 1

            End If
        Next
        For q = 0 To holderslistcounter
            visualveratext = visualveratext.Replace(Chr(holderslist(q)), "")

        Next
    End Sub

    Private Sub vcchange()
        Dim holder As String
        ' MsgBox("")
        vcyphercounter = 0

        officialvernatext = ""
        visualveratext = ""
        ' textdisplay.Text = ""
        '   If TheCCeaserloader.returndore = True Then
        If Len(VernamCypher.Text) <> 0 Then

            For i = 0 To Len(completefile) - 1
                '  MsgBox("binary" & completefile(i) & Asc(completefile(i)))
                ' If TheCCeaserloader.returndore = True Then
                If TheCCeaserloader.returndore = False Then
                    binarychar = vernamc.ToBinary(Asc(completefile(i)) - 130)

                Else
                    binarychar = vernamc.ToBinary(Asc(completefile(i)))

                End If

                ' Else
                '  binarychar = vernamc.ToBinary(Asc(completefile(i)))

                '  End If
                'MsgBox(vcyphercounter)
                If Len(VernamCypher.Text) = 1 Then
                    vcyphercounter = 0
                End If
                binarycypherchar = vernamc.convertcharactertobinary(VernamCypher.Text(vcyphercounter))
                'MsgBox(vcyphercounter)
                If vcyphercounter < Len(VernamCypher.Text) - 1 Then
                    vcyphercounter += 1
                Else
                    vcyphercounter = 0
                End If
                '    MsgBox(binarycypherchar & " " & binarychar)
                'MsgBox(binarycypherchar & " " & binarychar & " " & vernamc.DoanXOR(binarychar, binarycypherchar))
                holder = vernamc.DoanXOR(binarychar, binarycypherchar)
                ' MsgBox(vernamc.binarytochar(binarycypherchar))
                If TheCCeaserloader.returndore = True Then
                    visualveratext = visualveratext & vernamc.binarytochar(holder, True)
                    '  MsgBox(binarycypherchar)
                    ' officialvernatext = officialvernatext & vernamc.binarytocharnondisplay(binarycypherchar)
                    'MsgBox(visualveratext)
                    'MsgBox(officialvernatext)
                Else
                    '  MsgBox("decrypt" & holder)
                    ' If binarychar = "0" Then
                    'MsgBox("mmmmmmmmmmmmmmmm")
                    ' MsgBox(VernamCypher.Text(vcyphercounter))
                    'visualveratext = visualveratext & VernamCypher.Text(vcyphercounter)
                    ' Else
                    'MsgBox(vernamc.binarytochar(vernamc.DoanXOR(binarychar, binarycypherchar)))
                    ' MsgBox(binarycypherchar)
                    visualveratext = visualveratext & vernamc.binarytochar(holder, False)
                    'End If

                End If
                percentagev += 1
                ' MsgBox(percentagev)
            Next
            '  MsgBox("completea")
            '  dostandardisation()
            threader.Abort()
        Else
            percentagev = percentage.Maximum
            ' MsgBox("complete")
            visualveratext = completefile
            ' dostandardisation()
            threader.Abort()

        End If
        ' Else

        '  End If

    End Sub
    Private Sub dostandardisation()
        Dim holders As Integer
        Dim holderslist(10000) As Integer
        Dim holderslistcounter As Integer = 0
        percentage.Value = 0

        'For i = 0 To Len(visualveratext) - 1
        '    If Asc(visualveratext(i)) < 45 And visualveratext(i) <> " " Then
        '        holders = Asc(visualveratext(i))
        '        holderslist(holderslistcounter) = holders
        '        holderslistcounter += 1

        '    End If
        'Next

        'Try
        '    For q = 0 To holderslistcounter
        '        visualveratext = visualveratext.Replace(Chr(holderslist(q)), "")

        '    Next
        'Catch
        'End Try

        textdisplay.Text = visualveratext
        frequencyanalysis(textdisplay.Text)

        Timer1.Enabled = False

        percentage.Visible = False
        percentagev = 0
        VernamCypher.ReadOnly = False
    End Sub
    Private Sub VernamCypher_TextChanged(sender As Object, e As EventArgs) Handles VernamCypher.TextChanged
        VernamCypher.ReadOnly = True
        threader = New Threading.Thread((AddressOf vcchange))
        threader.Start()
        percentage.Visible = True
        Timer1.Enabled = True




    End Sub

    Private Sub Timer1_Tick(sender As Object, e As EventArgs) Handles Timer1.Tick
        percentage.Value = percentagev
    End Sub

    Private Sub Timer2_Tick(sender As Object, e As EventArgs) Handles Timer2.Tick
        If percentage.Value = percentage.Maximum Then
            dostandardisation()
        End If
    End Sub

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        Dim menu As New Form1
        menu.Show()
        Me.Close()
    End Sub

    Private Sub Timer3_Tick(sender As Object, e As EventArgs) Handles Timer3.Tick
        If vernamc.returncloseform() = "die" Then
            threader.Abort()
            vernamc.resetcloseform()
            Dim menu As New Form1
            menu.Show()
            Me.Close()
        End If
    End Sub
End Class